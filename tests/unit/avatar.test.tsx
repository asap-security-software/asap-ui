import { describe, expect, test } from "bun:test";
import { act, render, screen } from "@testing-library/react";
import { Avatar, AvatarFallback, AvatarImage } from "../../src/components/ui/avatar";

describe("Avatar", () => {
  test("shows initials when there is no photo", () => {
    render(
      <Avatar>
        <AvatarFallback>LT</AvatarFallback>
      </Avatar>,
    );
    expect(screen.getByText("LT")).toBeTruthy();
  });

  test("keeps the photo name", () => {
    render(
      <Avatar>
        <AvatarImage alt="Lead tech" src="data:image/gif;base64,R0lGODlhAQABAAAAACw=" />
        <AvatarFallback>LT</AvatarFallback>
      </Avatar>,
    );
    expect(screen.getByRole("img", { name: "Lead tech" })).toBeTruthy();
  });

  test("shows initials and no image when the photo fails to load", async () => {
    const NativeImage = window.Image;
    const loaders: HTMLImageElement[] = [];
    window.Image = class extends NativeImage {
      constructor() {
        super();
        loaders.push(this);
      }
    };
    try {
      const { container } = render(
        <Avatar>
          <AvatarImage alt="Lead tech" src="http://127.0.0.1:1/missing.png" />
          <AvatarFallback delayMs={0}>LT</AvatarFallback>
        </Avatar>,
      );
      expect(loaders.length).toBeGreaterThan(0);
      await act(async () => {
        for (const loader of loaders) loader.dispatchEvent(new Event("error"));
      });
      expect((await screen.findByText("LT")).textContent).toBe("LT");
      expect(screen.queryByRole("img", { name: "Lead tech" })).toBeNull();
      expect(container.querySelector("img")).toBeNull();
    } finally {
      window.Image = NativeImage;
    }
  });

  test("touch size is the 52px target", () => {
    const { container } = render(
      <Avatar size="touch">
        <AvatarFallback>LT</AvatarFallback>
      </Avatar>,
    );
    expect(container.querySelector("[data-slot=avatar]")?.className).toContain("size-touch");
  });
});
