import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "./button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./dropdown-menu";

const meta = {
  title: "UI/DropdownMenu",
  component: DropdownMenu,
} satisfies Meta<typeof DropdownMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

export const TaskActions: Story = {
  render: () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">Actions</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>This task</DropdownMenuLabel>
        <DropdownMenuItem>Assign to me</DropdownMenuItem>
        <DropdownMenuItem>Add a note</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="danger">Remove</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
};

export const Touch: Story = {
  render: () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="touch">Actions</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent size="touch">
        <DropdownMenuItem>Start</DropdownMenuItem>
        <DropdownMenuItem>Mark done</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
};
