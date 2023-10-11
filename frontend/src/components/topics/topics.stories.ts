import Topics from "@src/components/topics/topics";
import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof Topics> = {
  component: Topics,
  parameters: {
    layout: "fullscreen",
  },
};

type Story = StoryObj<typeof Topics>;

export const Basic: Story = {
  args: {
    topics: [{ name: "テスト" }],
  },
};

export default meta;
