import { describe, expect, test } from "bun:test";
import { render, screen } from "@testing-library/react";
import { Card, CardDescription, CardHeader, CardTitle } from "../../src/components/ui/card";

describe("Card", () => {
  test("renders the title as a heading with the description beside it", () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>North wing readers</CardTitle>
          <CardDescription>Due Nov 8</CardDescription>
        </CardHeader>
      </Card>,
    );
    expect(screen.getByRole("heading", { name: "North wing readers" }).tagName).toBe("H3");
    expect(screen.getByText("Due Nov 8").tagName).toBe("P");
  });
});
