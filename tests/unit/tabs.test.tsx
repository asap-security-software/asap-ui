import { describe, expect, test } from "bun:test";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../src/components/ui/tabs";

describe("Tabs", () => {
  test("shows the selected panel", async () => {
    const user = userEvent.setup();
    render(
      <Tabs defaultValue="details">
        <TabsList>
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="notes">Notes</TabsTrigger>
        </TabsList>
        <TabsContent value="details">Two readers.</TabsContent>
        <TabsContent value="notes">Backboxes are on site.</TabsContent>
      </Tabs>,
    );
    expect(screen.getByRole("tab", { name: "Details" }).getAttribute("aria-selected")).toBe("true");
    expect(screen.queryByText("Backboxes are on site.")).toBeNull();
    await user.click(screen.getByRole("tab", { name: "Notes" }));
    expect(screen.getByRole("tab", { name: "Notes" }).getAttribute("aria-selected")).toBe("true");
    expect(screen.getByText("Backboxes are on site.")).toBeTruthy();
  });

  test("touch triggers use the tall target", () => {
    render(
      <Tabs defaultValue="details">
        <TabsList size="touch">
          <TabsTrigger value="details">Details</TabsTrigger>
        </TabsList>
      </Tabs>,
    );
    expect(screen.getByRole("tab", { name: "Details" }).className).toContain("min-h-11");
  });
});
