#!/usr/bin/env node
/*
  Generates public/geo.json with all countries, states and cities when available.
  Primary data source (full cities): dr5hn/countries-states-cities-database
    - countries.json, states.json, cities.json (cities reference states by state_id)
  Fallback data source (states only): country-region-data (no cities)
  Output shape:
  {
    countries: [ { name: string, states: [ { name: string, cities: string[] } ] } ]
  }
*/

const fs = require('fs');
const path = require('path');

async function downloadJson(url) {
  const res = await fetch(url, { redirect: 'follow' });
  if (!res.ok) throw new Error(`Failed to download ${url}: ${res.status}`);
  return res.json();
}

function readLocalJSONIfExists(p) {
  try {
    if (fs.existsSync(p)) {
      return JSON.parse(fs.readFileSync(p, 'utf8'))
    }
  } catch {}
  return null
}

async function tryFullDataset() {
  // Prefer local vendor files if present (place JSONs under data/vendor)
  const localCountries = readLocalJSONIfExists(path.join(process.cwd(), 'data', 'vendor', 'countries.json'))
  const localStates = readLocalJSONIfExists(path.join(process.cwd(), 'data', 'vendor', 'states.json'))
  const localCities = readLocalJSONIfExists(path.join(process.cwd(), 'data', 'vendor', 'cities.json'))

  let countries, states, cities
  if (localCountries && localStates && localCities) {
    console.log('Using local vendor dataset from data/vendor/*.json')
    countries = localCountries
    states = localStates
    cities = localCities
  } else {
    // Try multiple mirrors for dr5hn
    const bases = [
      'https://raw.githubusercontent.com/dr5hn/countries-states-cities-database/master',
      'https://raw.githubusercontent.com/dr5hn/countries-states-cities-database/main',
      'https://cdn.jsdelivr.net/gh/dr5hn/countries-states-cities-database@master',
      'https://cdn.jsdelivr.net/gh/dr5hn/countries-states-cities-database@main',
    ]
    let lastErr
    for (const base of bases) {
      try {
        console.log('Attempting full dataset with cities from', base)
        const [c, s, ci] = await Promise.all([
          downloadJson(`${base}/countries.json`),
          downloadJson(`${base}/states.json`),
          downloadJson(`${base}/cities.json`),
        ])
        countries = c; states = s; cities = ci;
        lastErr = null
        break
      } catch (e) {
        lastErr = e
        console.warn('Mirror failed:', (e && e.message) || e)
      }
    }
    if (!countries || !states || !cities) {
      throw lastErr || new Error('All mirrors failed')
    }
  }

  // Index states -> by country_id and by id
  const statesByCountry = new Map();
  const stateById = new Map();
  for (const s of states) {
    stateById.set(s.id, s);
    const arr = statesByCountry.get(s.country_id) || [];
    arr.push(s);
    statesByCountry.set(s.country_id, arr);
  }

  // Group cities by state_id
  const citiesByState = new Map();
  for (const ci of cities) {
    const arr = citiesByState.get(ci.state_id) || [];
    arr.push(ci);
    citiesByState.set(ci.state_id, arr);
  }

  const out = {
    countries: countries
      .map((c) => ({
        name: c.name,
        states: (statesByCountry.get(c.id) || [])
          .sort((a, b) => a.name.localeCompare(b.name))
          .map((s) => ({
            name: s.name,
            cities: (citiesByState.get(s.id) || [])
              .map((ci) => ci.name)
              .sort((a, b) => a.localeCompare(b)),
          })),
      }))
      .sort((a, b) => a.name.localeCompare(b.name)),
  };
  // If split mode requested, also emit per-country city maps under public/geo/cities/<slug>.json
  if (process.argv.includes('--split-cities')) {
    const outDir = path.join(process.cwd(), 'public', 'geo', 'cities');
    fs.mkdirSync(outDir, { recursive: true });
    const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    for (const c of out.countries) {
      const map = Object.fromEntries((c.states || []).map((s) => [s.name, s.cities]));
      const p = path.join(outDir, `${slug(c.name)}.json`);
      fs.writeFileSync(p, JSON.stringify(map));
    }
    console.log(`Wrote per-country city files to ${outDir}`);
  }
  return out;
}

async function fallbackStatesOnly() {
  const dataUrl = 'https://raw.githubusercontent.com/country-regions/country-region-data/master/data.json';
  console.log('Falling back to states-only from country-region-data...');
  const list = await downloadJson(dataUrl);
  return {
    countries: list
      .map((c) => ({
        name: c.countryName,
        states: (c.regions || [])
          .map((r) => ({ name: r.name || r.name, cities: [] }))
          .sort((a, b) => a.name.localeCompare(b.name)),
      }))
      .sort((a, b) => a.name.localeCompare(b.name)),
  };
}

async function main() {
  let out;
  try {
    out = await tryFullDataset();
    console.log('✓ Generated full dataset with cities');
  } catch (e) {
    console.warn('! Failed to fetch full dataset, using fallback. Reason:', e.message || e);
    out = await fallbackStatesOnly();
  }

  const outPath = path.join(process.cwd(), 'public', 'geo.json');
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, JSON.stringify(out, null, 2));
  console.log(`Wrote ${out.countries.length} countries to ${outPath}`);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
