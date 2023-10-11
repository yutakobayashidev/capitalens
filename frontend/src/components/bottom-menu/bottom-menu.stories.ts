import BottomMenu from "@src/components/bottom-menu/bottom-menu";
import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof BottomMenu> = {
  component: BottomMenu,
  parameters: {
    layout: "fullscreen",
  },
};

type Story = StoryObj<typeof BottomMenu>;

export const Basic: Story = {};

export default meta;
