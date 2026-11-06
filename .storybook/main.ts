import type { StorybookConfig } from "@storybook/react-vite";
import tailwindcss from "@tailwindcss/vite";
import { mergeConfig } from "vite";

const config: StorybookConfig = {
  stories: ["../src/**/*.stories.@(ts|tsx)", "../stories/**/*.stories.@(ts|tsx)"],
  staticDirs: ["../public"],
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
  async viteFinal(config, { configType }) {
    const merged = mergeConfig(config, {
      plugins: [tailwindcss()],
      // Vite 8 serves React's CJS entry without a default interop unless it is
      // prebundled. Storybook's dev server imports that default.
      optimizeDeps: {
        include: ["react", "react-dom", "react/jsx-runtime", "react/jsx-dev-runtime"],
      },
    });
    // Relative URLs load at the root of a private Pages host
    // (https://<random>.pages.github.io/) and under a project subpath
    // (https://<owner>.github.io/<repo>/). Storybook's Vite builder already
    // defaults to this; keep it explicit so a later merge cannot pin `/`.
    if (configType === "PRODUCTION") {
      merged.base = "./";
    }
    return merged;
  },
};

export default config;
