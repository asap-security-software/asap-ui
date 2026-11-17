import { describe, expect, test } from "bun:test";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { Button } from "../../src/components/ui/button";

describe("Button", () => {
  test("defaults type to button so it does not submit a form", () => {
    const markup = renderToStaticMarkup(createElement(Button, null, "Start"));
    expect(markup).toContain('type="button"');
  });

  test("keeps an explicit type", () => {
    const markup = renderToStaticMarkup(createElement(Button, { type: "submit" }, "Save"));
    expect(markup).toContain('type="submit"');
    expect(markup).not.toContain('type="button"');
  });

  test("does not add a type when asChild renders another element", () => {
    const markup = renderToStaticMarkup(
      createElement(Button, { asChild: true }, createElement("a", { href: "/jobs" }, "Jobs")),
    );
    expect(markup).toContain('href="/jobs"');
    expect(markup).not.toContain("type=");
  });

  test("a disabled Button ignores clicks and stays a type=button disabled button", async () => {
    const user = userEvent.setup();
    let clicks = 0;
    render(
      createElement(
        Button,
        {
          disabled: true,
          onClick: () => {
            clicks += 1;
          },
        },
        "Start",
      ),
    );

    const button = screen.getByRole("button", { name: "Start" });
    await user.click(button);

    expect(clicks).toBe(0);
    expect(button).toHaveProperty("disabled", true);
    expect(button.getAttribute("type")).toBe("button");
  });
});
