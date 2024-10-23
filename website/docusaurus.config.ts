import { themes as prismThemes } from "prism-react-renderer";
import type { Config } from "@docusaurus/types";
import type * as Preset from "@docusaurus/preset-classic";

const config: Config = {
  title: "SeaSketch Geoprocessing",
  tagline:
    "Spatial analysis and reporting framework for the SeaSketch platform",
  favicon: "img/favicon.ico",

  // Set the production url of your site here
  url: "https://seasketch.github.io",
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: "/geoprocessing",

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: "seasketch", // Usually your GitHub org/user name.
  projectName: "geoprocessing", // Usually your repo name.
  trailingSlash: true,

  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "warn",

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: "en",
    locales: ["en"],
  },
  plugins: [
    [
      "docusaurus-plugin-typedoc",
      {
        entryPoints: [
          "../packages/geoprocessing/src/index.ts",
          "../packages/geoprocessing/client-ui.ts",
          "../packages/geoprocessing/client-core.ts",
          "../packages/geoprocessing/dataproviders.ts",
        ],
        tsconfig: "../packages/geoprocessing/tsconfig.json",
        plugin: ["./typedoc-plugin.mjs"],
        readme: "none",
        indexFormat: "table",
        disableSources: true,
        groupOrder: ["Classes", "Interfaces", "Enums"],
        sidebar: { pretty: true },
        textContentMappings: {
          "title.indexPage": "Typescript API",
          "title.memberPage": "{name}",
        },
        parametersFormat: "table",
        enumMembersFormat: "table",
        useCodeBlocks: true,
      },
    ],
  ],
  presets: [
    [
      "classic",
      {
        docs: {
          sidebarPath: "./sidebars.ts",
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            "https://github.com/seasketch/geoprocessing/tree/main/website/templates/shared/",
        },
        blog: false,
        theme: {
          customCss: "./src/css/custom.css",
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    // Replace with your project's social card
    image: "img/docusaurus-social-card.jpg",
    navbar: {
      title: "Geoprocessing",
      logo: {
        alt: "Site Logo",
        src: "img/ss-logo.png",
      },
      items: [
        {
          type: "docSidebar",
          sidebarId: "tutorialSidebar",
          position: "left",
          label: "Docs",
          to: "/docs",
        },
        {
          to: "/storybook",
          // Only one of "to" or "href" should be used
          // href: 'https://www.facebook.com',
          label: "Storybook",
          // Only one of "label" or "html" should be used
          // html: '<b>Introduction</b>'
          position: "left",
        },
        {
          type: "docsVersionDropdown",
          position: "right",
          dropdownActiveClassDisabled: true,
        },
        {
          href: "https://github.com/seasketch/geoprocessing",
          label: "GitHub",
          position: "right",
        },
      ],
    },
    footer: {
      style: "dark",
      links: [
        {
          title: "Docs",
          items: [
            {
              label: "Getting Started",
              to: "/docs",
            },
            {
              label: "Contributing",
              to: "/docs/contributing",
            },
          ],
        },
        {
          title: "More",
          items: [
            {
              label: "UI Component Library",
              href: "https://seasketch.github.io/geoprocessing/storybook/index.html",
            },
            {
              label: "GitHub",
              href: "https://github.com/seasketch/geoprocessing",
            },
            {
              label: "SeaSketch",
              href: "https://seasketch.org",
            },
            {
              label: "SeaSketch GitHub",
              href: "https://github.com/seasketch/next",
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} The Regents of the University of California.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
