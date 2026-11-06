import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "./button";
import { Separator } from "./separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./sheet";
import { StatusPill } from "./status-pill";

const meta = {
  title: "UI/Sheet",
  component: Sheet,
} satisfies Meta<typeof Sheet>;

export default meta;
type Story = StoryObj<typeof meta>;

export const TaskDetail: Story = {
  render: () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">Open task</Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <div className="text-asap-xs font-semibold text-primary">Memorial Hospital · Access</div>
          <SheetTitle>Floor 3 — north wing readers</SheetTitle>
          <div className="mt-1 flex items-center gap-2.5">
            <StatusPill status="progress">In progress</StatusPill>
            <span className="text-asap-sm text-muted tabular-nums">Due Nov 8</span>
          </div>
        </SheetHeader>
        <Separator />
        <SheetDescription>
          Replace the two failed readers by the stair. The backboxes are already on site.
        </SheetDescription>
        <SheetFooter>
          <Button size="touch" className="w-full">
            Mark done
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  ),
};

export const Bottom: Story = {
  render: () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">Add a note</Button>
      </SheetTrigger>
      <SheetContent side="bottom">
        <SheetHeader>
          <SheetTitle>Add a note</SheetTitle>
          <SheetDescription>Plain words. The office sees this on the task.</SheetDescription>
        </SheetHeader>
        <SheetFooter>
          <Button size="touch" className="w-full">
            Save note
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  ),
};
