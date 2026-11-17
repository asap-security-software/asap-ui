import { describe, expect, test } from "bun:test";
import { render, screen } from "@testing-library/react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../src/components/ui/card";

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

  test("renders body text in the card-content slot and footer text in the card-footer slot", () => {
    render(
      <Card>
        <CardContent>Replace 12 readers on floor 2</CardContent>
        <CardFooter>Assigned to Dana</CardFooter>
      </Card>,
    );
    const content = screen.getByText("Replace 12 readers on floor 2");
    expect(content.getAttribute("data-slot")).toBe("card-content");
    const footer = screen.getByText("Assigned to Dana");
    expect(footer.getAttribute("data-slot")).toBe("card-footer");
  });
});
