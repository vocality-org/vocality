module.exports = {
  title: 'Vocality Documentation',
  tagline: 'The plugin based discord bot',
  url: 'https://github.com/vocality-org/vocality',
  baseUrl: '/vocality/',
  favicon: 'img/favicon.ico',
  organizationName: 'vocality-org',
  projectName: 'vocality',
  themeConfig: {
    navbar: {
      title: 'Vocality Documentation',
      logo: {
        alt: 'Logo',
        src: 'img/logo.svg',
      },
      links: [
        { to: 'docs/globals', label: 'Docs', position: 'left' },
        {
          href: 'https://github.com/vocality-org/vocality',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    algolia: {
      indexName: 'prod_VOCALITY_DOCS',
    },
  },
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
        },
      },
    ],
  ],
};
