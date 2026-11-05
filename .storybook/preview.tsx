import type { Preview } from "@storybook/react-vite";
import "@fontsource-variable/inter";
import { Toaster } from "../src/components/ui/sonner";
import { TooltipProvider } from "../src/components/ui/tooltip";
import "../src/storybook.css";

const preview: Preview = {
  decorators: [
    (Story) => (
      <TooltipProvider>
        <div className="asap-root min-h-40 p-2 text-ink">
          <Story />
          <Toaster />
        </div>
      </TooltipProvider>
    ),
  ],
  parameters: {
    layout: "padded",
    backgrounds: {
      default: "paper",
      values: [
        { name: "paper", value: "#f7f4f0" },
        { name: "surface", value: "#fffcf9" },
      ],
    },
    options: {
      storySort: {
        order: ["Tokens", "UI"],
      },
    },
  },
};

export default preview;
