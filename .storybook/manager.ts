import { addons } from "storybook/manager-api";
import { create } from "storybook/theming";

addons.setConfig({
  theme: create({
    base: "light",
    brandTitle: "ASAP UI",
    brandImage: "/logo.png",
    brandUrl: "https://www.serviceasap.com/",
    brandTarget: "_blank",
    colorPrimary: "#a60e13",
    colorSecondary: "#a60e13",
    appBg: "#f7f4f0",
    appContentBg: "#fffcf9",
    appBorderColor: "#ebe6e1",
    appBorderRadius: 9,
    fontBase: '"Inter Variable", "Inter", "Geist", sans-serif',
    textColor: "#212121",
    barTextColor: "#6f6862",
    barSelectedColor: "#a60e13",
  }),
});
