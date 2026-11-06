import { describe, expect, test } from "bun:test";
import { render, screen } from "@testing-library/react";
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

  test("touch size is the 52px target", () => {
    const { container } = render(
      <Avatar size="touch">
        <AvatarFallback>LT</AvatarFallback>
      </Avatar>,
    );
    expect(container.querySelector("[data-slot=avatar]")?.className).toContain("size-touch");
  });
});
