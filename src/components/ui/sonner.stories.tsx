import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { Button } from "./button";
import { toastWithUndo } from "./sonner";

const meta = {
  title: "UI/Toast",
  component: Button,
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

function UndoStory() {
  const [note, setNote] = useState("Nothing to undo.");
  return (
    <div className="flex w-[360px] flex-col gap-3">
      <Button
        onClick={() => {
          setNote("Marked done.");
          toastWithUndo("Marked done", () => {
            setNote("Undone. The task is in progress again.");
          });
        }}
      >
        Mark done
      </Button>
      <p className="text-asap-sm text-muted">{note}</p>
    </div>
  );
}

export const Undo: Story = {
  render: () => <UndoStory />,
};
