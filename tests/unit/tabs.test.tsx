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

  test("ArrowRight and ArrowLeft move selection, focus, and the shown panel", async () => {
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
    const details = screen.getByRole("tab", { name: "Details" });
    const notes = screen.getByRole("tab", { name: "Notes" });

    await user.tab();
    expect(document.activeElement).toBe(details);
    expect(details.getAttribute("aria-selected")).toBe("true");
    expect(notes.getAttribute("aria-selected")).toBe("false");
    expect(screen.getByText("Two readers.")).toBeTruthy();
    expect(screen.queryByText("Backboxes are on site.")).toBeNull();

    await user.keyboard("{ArrowRight}");
    expect(document.activeElement).toBe(notes);
    expect(notes.getAttribute("aria-selected")).toBe("true");
    expect(details.getAttribute("aria-selected")).toBe("false");
    expect(screen.getByText("Backboxes are on site.")).toBeTruthy();
    expect(screen.queryByText("Two readers.")).toBeNull();

    await user.keyboard("{ArrowLeft}");
    expect(document.activeElement).toBe(details);
    expect(details.getAttribute("aria-selected")).toBe("true");
    expect(notes.getAttribute("aria-selected")).toBe("false");
    expect(screen.getByText("Two readers.")).toBeTruthy();
    expect(screen.queryByText("Backboxes are on site.")).toBeNull();
  });

  test("ArrowRight skips a disabled trigger and selects, focuses, and shows the next enabled tab", async () => {
    const user = userEvent.setup();
    render(
      <Tabs defaultValue="details">
        <TabsList>
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="notes" disabled>
            Notes
          </TabsTrigger>
          <TabsTrigger value="photos">Photos</TabsTrigger>
        </TabsList>
        <TabsContent value="details">Two readers.</TabsContent>
        <TabsContent value="notes">Backboxes are on site.</TabsContent>
        <TabsContent value="photos">Eleven photos.</TabsContent>
      </Tabs>,
    );
    const details = screen.getByRole("tab", { name: "Details" });
    const notes = screen.getByRole("tab", { name: "Notes" });
    const photos = screen.getByRole("tab", { name: "Photos" });

    await user.tab();
    expect(document.activeElement).toBe(details);
    expect(details.getAttribute("aria-selected")).toBe("true");
    expect(notes.getAttribute("aria-selected")).toBe("false");
    expect(photos.getAttribute("aria-selected")).toBe("false");
    expect(screen.getByText("Two readers.")).toBeTruthy();
    expect(screen.queryByText("Backboxes are on site.")).toBeNull();
    expect(screen.queryByText("Eleven photos.")).toBeNull();

    await user.keyboard("{ArrowRight}");
    expect(document.activeElement).toBe(photos);
    expect(document.activeElement).not.toBe(notes);
    expect(details.getAttribute("aria-selected")).toBe("false");
    expect(notes.getAttribute("aria-selected")).toBe("false");
    expect(photos.getAttribute("aria-selected")).toBe("true");
    expect(screen.getByText("Eleven photos.")).toBeTruthy();
    expect(screen.queryByText("Two readers.")).toBeNull();
    expect(screen.queryByText("Backboxes are on site.")).toBeNull();
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
