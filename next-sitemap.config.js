module.exports = {
  siteUrl: 'https://oneteenonetree.org',
  generateRobotsTxt: true,
  sitemapSize: 5000,
  changefreq: 'weekly',
  priority: 0.7,
  exclude: ['/admin/*', '/dashboard/*', '/debug/*', '/auth/*', '/api/*'],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/admin/', '/api/', '/auth/', '/dashboard', '/dashboard/', '/debug/'],
      },
    ],
    additionalSitemaps: ['https://oneteenonetree.org/sitemap.xml'],
  },
}
