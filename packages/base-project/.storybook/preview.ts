import type { Preview } from "@storybook/react";

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /date$/i,
      },
    },
    options: {
      storySort: {
        method: "",
        order: ["Project", ["ReportClients", "Components"]],
        locales: "",
      },
    },
  },
};

export default preview;
