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
    expect(screen.getByText("LT").textContent).toBe("LT");
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

  test("shows initials and no image when the photo reports an error status", async () => {
    const statuses: string[] = [];
    const { container } = render(
      <Avatar>
        <AvatarImage
          alt="Lead tech"
          src="http://127.0.0.1:1/missing.png"
          onLoadingStatusChange={(status) => statuses.push(status)}
        />
        <AvatarFallback delayMs={0}>LT</AvatarFallback>
      </Avatar>,
    );
    expect((await screen.findByText("LT")).textContent).toBe("LT");
    expect(statuses.at(-1)).toBe("error");
    expect(screen.queryByRole("img", { name: "Lead tech" })).toBeNull();
    expect(container.querySelector("img")).toBeNull();
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
