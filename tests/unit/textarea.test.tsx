import { describe, expect, spyOn, test } from "bun:test";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { Textarea } from "../../src/components/ui/textarea";

function ControlledTextarea() {
  const [value, setValue] = useState("");
  return (
    <>
      <Textarea aria-label="Note" value={value} onChange={(e) => setValue(e.target.value)} />
      <output aria-label="State">{value}</output>
    </>
  );
}

describe("Textarea", () => {
  test("renders a multiline field and grows the touch size for notes", () => {
    const { container } = render(
      <Textarea size="touch" disabled aria-label="Note" defaultValue="On site" />,
    );
    const field = container.querySelector("textarea");
    expect(field).toBeTruthy();
    expect(field?.className).toContain("min-h-36");
    expect(field?.disabled).toBe(true);
    expect(field?.value).toBe("On site");
  });

  test("a controlled Textarea starting at empty follows state exactly without a controlled/uncontrolled warning", async () => {
    const user = userEvent.setup();
    const errorSpy = spyOn(console, "error").mockImplementation(() => {});
    const warnSpy = spyOn(console, "warn").mockImplementation(() => {});
    try {
      render(<ControlledTextarea />);
      const field = screen.getByRole("textbox", { name: "Note" });
      if (!(field instanceof HTMLTextAreaElement)) throw new Error("expected a textarea");
      expect(field.value).toBe("");

      await user.click(field);
      expect(document.activeElement).toBe(field);
      await user.keyboard("Gate{Enter}code");
      expect(document.activeElement).toBe(field);
      expect(field.value).toBe("Gate\ncode");
      expect(screen.getByLabelText("State").textContent).toBe("Gate\ncode");

      await user.keyboard("{Backspace}{Backspace}");
      expect(field.value).toBe("Gate\nco");
      expect(screen.getByLabelText("State").textContent).toBe("Gate\nco");

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
});
