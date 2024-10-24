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
      items: [
        "introduction",
        "concepts/Concepts",
        {
          type: "category",
          label: "Tutorials",
          items: [
            {
              type: "doc",
              id: "tutorials/Tutorials",
              label: "Introduction",
            },
            {
              type: "doc",
              id: "tutorials/newproject",
              label: "Create New Project",
            },
            {
              type: "doc",
              id: "tutorials/existingproject",
              label: "Setup Existing Project",
            },
            {
              type: "doc",
              id: "tutorials/deploy",
              label: "Deploy Project",
            },
            {
              type: "doc",
              id: "tutorials/createGeoprocessing",
              label: "New Geoprocessing Function",
            },
            {
              type: "doc",
              id: "tutorials/createReport",
              label: "New Report Client",
            },
          ],
        },
        "CLI",
        {
          type: "doc",
          id: "skills",
          label: "Skill Building",
        },
      ],
    },
    {
      type: "category",
      label: "Advanced",
      items: [
        {
          type: "doc",
          id: "concepts/AdvancedConcepts",
          label: "Concepts",
        },
        {
          type: "category",
          label: "Tutorials",
          items: [
            {
              type: "doc",
              id: "upgrade",
              label: "Upgrade Project",
            },
            {
              type: "doc",
              id: "tutorials/updateDatasource",
              label: "Update Datasource",
            },
          ],
        },
        {
          type: "category",
          label: "Guides",
          items: [
            "preprocessing",
            "geoprocessing",
            "reportclient",
            "workers",
            "tutorials/sketchAttributes",
            {
              type: "doc",
              id: "tutorials/extraParams",
              label: "Extra Function Parameters",
            },
            {
              type: "doc",
              id: "tutorials/subdividing",
              label: "Subdividing Data",
            },
            "antimeridian/Antimeridian",
            "Testing",
            {
              type: "doc",
              id: "tutorials/storybook",
              label: "Storybook",
            },
          ],
        },
        "architecture/Architecture",
        "EdgesAndLimits",
      ],
    },
    {
      type: "category",
      label: "Library",
      items: [
        "api/index",
        { type: "doc", id: "Extending", label: "Extending" },
        "Contributing",
      ],
    },
    {
      type: "category",
      label: "Improvement Proposals",
      items: [
        {
          type: "doc",
          id: "gip/GIP-1-i18n",
          label: "GIP-1: Internationalization",
        },
      ],
    },
  ],
};

export default sidebars;
