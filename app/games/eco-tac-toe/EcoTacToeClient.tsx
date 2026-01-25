"use client";

import { useEffect, useMemo, useState } from "react";

/* ---------- Eco icons (inline SVGs) ---------- */
function SunIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <g fill="currentColor">
        <path d="M12 6.5a5.5 5.5 0 1 1 0 11a5.5 5.5 0 0 1 0-11Z" />
        <path d="M12 1v3M12 20v3M4.22 4.22l2.12 2.12M17.66 17.66l2.12 2.12M1 12h3M20 12h3M4.22 19.78l2.12-2.12M17.66 6.34l2.12-2.12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
      </g>
    </svg>
  );
}

function PotPlantIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <g fill="currentColor">
        {/* Pot */}
        <path d="M6 12h12l-1 7a3 3 0 0 1-3 3H10a3 3 0 0 1-3-3l-1-7Z" />
        {/* Stem */}
        <path d="M12 12V7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
        {/* Leaves */}
        <path d="M12 9c2.2 0 4-1.5 4-3.5c-2.2 0-4 1.5-4 3.5Zm0 0c-2.2 0-4-1.5-4-3.5c2.2 0 4 1.5 4 3.5Z" />
      </g>
    </svg>
  );
}

/* ---------- Types ---------- */
type Cell = null | "sun" | "plant";

const LINES = [
  [0, 1, 2], // rows
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6], // cols
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8], // diagonals
  [2, 4, 6],
];

/* ---------- Helpers ---------- */
function calcWinner(cells: Cell[]) {
  for (const [a, b, c] of LINES) {
    if (cells[a] && cells[a] === cells[b] && cells[a] === cells[c]) {
      return { winner: cells[a] as Exclude<Cell, null>, line: [a, b, c] as const };
    }
  }
  if (cells.every(Boolean)) return { winner: "draw" as const, line: [] as const };
  return null;
}

const STORAGE_KEY = "eco-tac-toe-score-v1";

export default function EcoTacToeClient() {
  const [cells, setCells] = useState<Cell[]>(Array(9).fill(null));
  const [turn, setTurn] = useState<Exclude<Cell, null>>("sun"); // sun starts
  const [history, setHistory] = useState<number[]>([]); // indices played

  const [p1Name, setP1Name] = useState("Player ☀️");
  const [p2Name, setP2Name] = useState("Player 🌱");

  const [score, setScore] = useState<{ sun: number; plant: number; draw: number }>({
    sun: 0,
    plant: 0,
    draw: 0,
  });

  // Load score from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setScore(JSON.parse(raw));
    } catch {}
  }, []);
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(score));
    } catch {}
  }, [score]);

  const result = useMemo(() => calcWinner(cells), [cells]);
  const isOver = !!result;

  const play = (i: number) => {
    if (cells[i] || isOver) return;
    const next = cells.slice();
    next[i] = turn;
    setCells(next);
    setHistory((h) => [...h, i]);
    setTurn(turn === "sun" ? "plant" : "sun");
  };

  const undo = () => {
    if (history.length === 0 || isOver) return;
    const last = history[history.length - 1];
    const next = cells.slice();
    next[last] = null;
    setCells(next);
    setHistory((h) => h.slice(0, -1));
    setTurn(turn === "sun" ? "plant" : "sun");
  };

  const hardReset = () => {
    setCells(Array(9).fill(null));
    setHistory([]);
    setTurn("sun");
  };

  useEffect(() => {
    if (!result) return;
    if (result.winner === "sun") setScore((s) => ({ ...s, sun: s.sun + 1 }));
    else if (result.winner === "plant") setScore((s) => ({ ...s, plant: s.plant + 1 }));
    else setScore((s) => ({ ...s, draw: s.draw + 1 }));
  }, [result?.winner]); // once per game end

  const TurnIcon =
    turn === "sun" ? (
      <SunIcon className="w-5 h-5 text-amber-300" />
    ) : (
      <PotPlantIcon className="w-5 h-5 text-emerald-300" />
    );

  const cellIcon = (v: Cell) =>
    v === "sun" ? (
      <SunIcon className="w-8 h-8 md:w-10 md:h-10 text-amber-300 drop-shadow" />
    ) : v === "plant" ? (
      <PotPlantIcon className="w-8 h-8 md:w-10 md:h-10 text-emerald-300 drop-shadow" />
    ) : null;

  const winnerText =
    result?.winner === "sun"
      ? `${p1Name} wins! ☀️`
      : result?.winner === "plant"
      ? `${p2Name} wins! 🌱`
      : result?.winner === "draw"
      ? "It’s a draw."
      : null;

  return (
    <section className="max-w-5xl mx-auto space-y-6">
      {/* Scoreboard */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="card flex items-center justify-between">
            <div className="flex items-center gap-3">
              <SunIcon className="w-6 h-6 text-amber-300" />
              <input
                value={p1Name}
                onChange={(e) => setP1Name(e.target.value)}
                className="bg-transparent outline-none border-b border-white/10 focus:border-amber-300/60 transition w-40"
              />
            </div>
            <div className="text-2xl font-semibold">{score.sun}</div>
          </div>
          <div className="card text-center">
            <div className="text-white/60 text-sm">Draws</div>
            <div className="text-2xl font-semibold">{score.draw}</div>
          </div>
          <div className="card flex items-center justify-between">
            <div className="flex items-center gap-3">
              <PotPlantIcon className="w-6 h-6 text-emerald-300" />
              <input
                value={p2Name}
                onChange={(e) => setP2Name(e.target.value)}
                className="bg-transparent outline-none border-b border-white/10 focus:border-emerald-300/60 transition w-40"
              />
            </div>
            <div className="text-2xl font-semibold">{score.plant}</div>
          </div>
        </div>

      {/* Board & controls */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 md:p-6">
            {/* Status */}
            <div className="flex items-center justify-between mb-4">
              {!isOver ? (
                <div className="flex items-center gap-2 text-white/80">
                  <span className="text-sm">Turn:</span>
                  {TurnIcon}
                  <span className="font-medium">{turn === "sun" ? p1Name : p2Name}</span>
                </div>
              ) : (
                <div className="text-emerald-300 font-semibold">{winnerText}</div>
              )}

              <div className="flex items-center gap-2">
                <button
                  onClick={undo}
                  disabled={history.length === 0 || isOver}
                  className="px-3 py-1.5 rounded-lg border border-white/10 hover:bg-white/10 disabled:opacity-50"
                >
                  Undo
                </button>
                <button
                  onClick={hardReset}
                  className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white hover:bg-emerald-500"
                >
                  New Round
                </button>
              </div>
            </div>

            {/* 3x3 grid */}
            <div className="grid grid-cols-3 gap-2 md:gap-3">
              {cells.map((v, i) => {
                const inWin = !!(result && (result.line as ReadonlyArray<number>).includes(i));
                return (
                  <button
                    key={i}
                    onClick={() => play(i)}
                    className={`aspect-square rounded-xl grid place-items-center text-3xl
                      bg-white/[0.03] border border-white/10 hover:bg-white/[0.06] transition
                      ${inWin ? "ring-2 ring-emerald-400/80" : ""}`}
                    aria-label={`cell ${i + 1}`}
                  >
                    {cellIcon(v)}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Tips / rules */}
          <aside className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 md:p-6">
            <h3 className="font-semibold">Rules</h3>
            <ul className="text-white/70 text-sm list-disc ml-4 mt-2 space-y-1">
              <li>Two players take turns placing ☀️ and 🌱.</li>
              <li>First to line up three (row, column, or diagonal) wins.</li>
              <li>Click <b>New Round</b> to start again; scores persist locally.</li>
              <li><b>Undo</b> removes the last move (only before the game ends).</li>
            </ul>

            <div className="mt-4 text-sm text-white/60">
              Coming soon: best-of series, bot mode, and shareable results.
            </div>
          </aside>
      </div>
    </section>
  );
}
