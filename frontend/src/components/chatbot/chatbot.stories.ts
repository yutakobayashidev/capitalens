import Chatbot from "@src/components/chatbot/chatbot";
import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof Chatbot> = {
  component: Chatbot,
  parameters: {
    layout: "fullscreen",
  },
};

type Story = StoryObj<typeof Chatbot>;

export const Basic: Story = {};

export default meta;
