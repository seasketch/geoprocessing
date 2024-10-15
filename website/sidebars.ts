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
        "architecture/Architecture",
        "Migrating",
        "Extending",
        "Tipsandtricks",
      ],
    },
    {
      type: "category",
      label: "Library",
      items: ["api/index"],
    },
    {
      type: "category",
      label: "Advanced Guides",
      items: ["gip/GIP-1-i18n", "EdgesAndLimits", "Testing", "Contributing"],
    },
    {
      type: "category",
      label: "Other",
      items: ["Tipsandtricks"],
    },
  ],
};

export default sidebars;
