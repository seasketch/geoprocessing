import type { SidebarsConfig } from "@docusaurus/plugin-content-docs";

/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.
 */
const sidebars: SidebarsConfig = {
  tutorialSidebar: [
    {
      type: "category",
      label: "Getting Started",
      collapsed: false,
      items: [
        "introduction",
        "concepts/Concepts",
        "tutorials/Tutorials",
        "CLI",
        "Tipsandtricks",
      ],
    },
    {
      type: "category",
      label: "Library",
      collapsed: false,
      items: ["api/index", "Migrating", "Extending"],
    },
    {
      type: "category",
      label: "Advanced Guides",
      items: [
        "architecture/Architecture",
        "antimeridian/Antimeridian",
        "workers",
        "gip/GIP-1-i18n",
        "EdgesAndLimits",
        "Testing",
        "Contributing",
      ],
    },
  ],
};

export default sidebars;
