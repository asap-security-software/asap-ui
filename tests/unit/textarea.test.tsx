import { describe, expect, test } from "bun:test";
import { render } from "@testing-library/react";
import { Textarea } from "../../src/components/ui/textarea";

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
});
