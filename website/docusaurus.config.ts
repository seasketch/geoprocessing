import { themes as prismThemes } from "prism-react-renderer";
import type { Config } from "@docusaurus/types";
import type * as Preset from "@docusaurus/preset-classic";

const config: Config = {
  title: "SeaSketch Geoprocessing",
  tagline: "Low cost spatial analysis and reporting for the SeaSketch platform",
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

  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "warn",

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: "en",
    locales: ["en"],
  },

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
          href: "https://seasketch.github.io/geoprocessing/api/index.html",
          label: "Typescript library",
          position: "left",
        },
        {
          href: "https://seasketch.github.io/geoprocessing/storybook/index.html",
          label: "UI Component Library",
          position: "left",
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
              label: "Tutorial",
              to: "/docs/intro",
            },
          ],
        },
        {
          title: "More",
          items: [
            {
              label: "Docs",
              to: "/docs",
            },
            {
              label: "Typescript library",
              href: "https://seasketch.github.io/geoprocessing/api/index.html",
            },
            {
              label: "UI Component Library",
              href: "https://seasketch.github.io/geoprocessing/storybook/index.html",
            },
            {
              label: "GitHub",
              href: "https://github.com/seasketch/geoprocessing",
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
