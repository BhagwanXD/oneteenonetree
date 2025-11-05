module.exports = {
  siteUrl: 'https://www.oneteenonetree.org',
  generateRobotsTxt: true,
  sitemapSize: 5000,
  changefreq: 'weekly',
  priority: 0.7,
  exclude: ['/admin/*'],
  robotsTxtOptions: {
    additionalSitemaps: [
      'https://www.oneteenonetree.org/sitemap.xml',
    ],
  },
}