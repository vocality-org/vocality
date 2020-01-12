module.exports = {
  title: 'Vocality Documentation',
  tagline: 'Documentation for the vocality core package',
  url: 'https://github.com/vocality-org/vocality',
  baseUrl: '/vocality/',
  favicon: 'img/favicon.ico',
  organizationName: 'vocality-org',
  projectName: 'vocality',
  themeConfig: {
    navbar: {
      title: 'Vocality Documentation',
      links: [
        { to: 'docs/globals', label: 'Docs', position: 'left' },
        {
          href: 'https://github.com/vocality-org/vocality',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
  },
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
        },
      },
    ],
  ],
};
