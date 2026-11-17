import { describe, expect, spyOn, test } from "bun:test";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { Input } from "../../src/components/ui/input";

function ControlledInput() {
  const [value, setValue] = useState("");
  return (
    <>
      <Input aria-label="Job" value={value} onChange={(e) => setValue(e.target.value)} />
      <output aria-label="State">{value}</output>
    </>
  );
}

describe("Input", () => {
  test("keeps the requested type and does not leak the visual size onto the DOM", () => {
    const { container } = render(
      <Input type="email" size="touch" aria-invalid placeholder="Email" aria-label="Email" />,
    );
    const input = container.querySelector("input");
    expect(input?.getAttribute("type")).toBe("email");
    expect(input?.className).toContain("min-h-touch");
    expect(input?.hasAttribute("size")).toBe(false);
    expect(input?.getAttribute("aria-invalid")).toBe("true");
    expect(input?.getAttribute("placeholder")).toBe("Email");
  });

  test("a controlled Input starting at empty follows state exactly without a controlled/uncontrolled warning", async () => {
    const user = userEvent.setup();
    const errorSpy = spyOn(console, "error").mockImplementation(() => {});
    const warnSpy = spyOn(console, "warn").mockImplementation(() => {});
    try {
      render(<ControlledInput />);
      const field = screen.getByRole("textbox", { name: "Job" });
      if (!(field instanceof HTMLInputElement)) throw new Error("expected an input");
      expect(field.value).toBe("");

      await user.click(field);
      expect(document.activeElement).toBe(field);
      await user.keyboard("Roof");
      expect(document.activeElement).toBe(field);
      expect(field.value).toBe("Roof");
      expect(screen.getByLabelText("State").textContent).toBe("Roof");

      await user.keyboard("{Backspace}{Backspace}");
      expect(field.value).toBe("Ro");
      expect(screen.getByLabelText("State").textContent).toBe("Ro");

      await user.clear(field);
      expect(field.value).toBe("");
      expect(screen.getByLabelText("State").textContent).toBe("");
      expect(document.activeElement).toBe(field);

      const messages = [...errorSpy.mock.calls, ...warnSpy.mock.calls].map((args) =>
        args.map(String).join(" "),
      );
      expect(messages.filter((m) => /controlled|uncontrolled/i.test(m))).toEqual([]);
    } finally {
      errorSpy.mockRestore();
      warnSpy.mockRestore();
    }
  });

  test("can be disabled", () => {
    const { container } = render(<Input disabled aria-label="Job" />);
    expect(container.querySelector("input")?.disabled).toBe(true);
  });
});
