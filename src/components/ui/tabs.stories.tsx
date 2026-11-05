import type { Meta, StoryObj } from "@storybook/react-vite";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./tabs";

const meta = {
  title: "UI/Tabs",
  component: Tabs,
} satisfies Meta<typeof Tabs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Task: Story = {
  render: () => (
    <Tabs defaultValue="details" className="w-[360px]">
      <TabsList>
        <TabsTrigger value="details">Details</TabsTrigger>
        <TabsTrigger value="notes">Notes</TabsTrigger>
        <TabsTrigger value="parts">Parts</TabsTrigger>
      </TabsList>
      <TabsContent value="details">Two readers by the north stair.</TabsContent>
      <TabsContent value="notes">Backboxes are already on site.</TabsContent>
      <TabsContent value="parts">No parts logged yet.</TabsContent>
    </Tabs>
  ),
};

export const Touch: Story = {
  render: () => (
    <Tabs defaultValue="details" className="w-[360px]">
      <TabsList size="touch" className="w-full">
        <TabsTrigger value="details">Details</TabsTrigger>
        <TabsTrigger value="notes">Notes</TabsTrigger>
      </TabsList>
      <TabsContent value="details">Two readers by the north stair.</TabsContent>
      <TabsContent value="notes">Backboxes are already on site.</TabsContent>
    </Tabs>
  ),
};
