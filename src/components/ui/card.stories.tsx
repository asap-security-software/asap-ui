import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "./button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./card";
import { StatusPill } from "./status-pill";

const meta = {
  title: "UI/Card",
  component: Card,
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Task: Story = {
  render: () => (
    <Card className="w-[360px]">
      <CardHeader>
        <div className="text-asap-xs font-semibold text-primary">Memorial Hospital · Access</div>
        <CardTitle>Floor 3 — north wing readers</CardTitle>
        <div className="mt-1 flex items-center gap-2.5">
          <StatusPill status="progress">In progress</StatusPill>
          <span className="text-asap-sm text-muted tabular-nums">Due Nov 8</span>
        </div>
      </CardHeader>
      <CardContent>
        <CardDescription>Replace the two failed readers by the stair.</CardDescription>
      </CardContent>
      <CardFooter>
        <Button size="touch" className="w-full">
          Mark done
        </Button>
      </CardFooter>
    </Card>
  ),
};
