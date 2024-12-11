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
        "architecture/Architecture",
        "CLI",
        "EdgesAndLimits",
      ],
    },
    {
      type: "category",
      label: "Tutorials",
      items: [
        {
          type: "doc",
          id: "tutorials/Tutorials",
          label: "System Setup",
        },
        {
          type: "doc",
          id: "tutorials/sampleproject",
          label: "Create Sample Project",
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
          id: "tutorials/updateDatasource",
          label: "Update Datasource",
        },
        {
          type: "doc",
          id: "tutorials/upgrade",
          label: "Upgrade Project",
        },
        {
          type: "doc",
          id: "thirdpartydata/thirdpartydata",
          label: "Third Party Data",
        },
        {
          type: "doc",
          id: "tutorials/clouddrive",
          label: "Cloud Drive Syncing",
        },
      ],
    },
    {
      type: "category",
      label: "Guides",
      items: [
        {
          type: "doc",
          id: "structure",
          label: "Project Structure",
        },
        {
          type: "doc",
          id: "projectclient",
          label: "Project Client",
        },
        {
          type: "doc",
          id: "linkData",
          label: "Link Project Data",
        },
        {
          type: "doc",
          id: "dataimport",
          label: "Data Import",
        },
        {
          type: "doc",
          id: "dataproviders",
          label: "Data Fetching",
        },
        {
          type: "doc",
          id: "toolbox/toolbox",
          label: "Spatial Toolbox",
        },
        {
          type: "doc",
          id: "precalc",
          label: "Precalc Data",
        },
        {
          type: "doc",
          id: "preprocessing",
          label: "Preprocessing Functions",
        },
        {
          type: "doc",
          id: "geoprocessing",
          label: "Geoprocessing Functions",
        },
        "workers",
        "tutorials/sketchAttributes",
        {
          type: "doc",
          id: "tutorials/extraParams",
          label: "Extra Function Parameters",
        },
        {
          type: "doc",
          id: "multiBoundary/multiBoundary",
          label: "Multi-Boundary",
        },
        "antimeridian/Antimeridian",
        "Testing",
        {
          type: "doc",
          id: "tutorials/storybook",
          label: "Storybook",
        },
        {
          type: "doc",
          id: "devcontainer/devcontainer",
          label: "Devcontainer",
        },
        { type: "doc", id: "codespaces/codespaces", label: "Codespaces" },
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
