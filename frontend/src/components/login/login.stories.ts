import { Login } from "@src/components/login/login";
import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof Login> = {
  component: Login,
  parameters: {
    layout: "fullscreen",
  },
};

type Story = StoryObj<typeof Login>;

export const Basic: Story = {};

export default meta;
