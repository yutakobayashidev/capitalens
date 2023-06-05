import type { Meta, StoryObj } from "@storybook/react";
import Footer from "@src/app/_components/Footer";

const meta: Meta<typeof Footer> = {
  component: Footer,
  parameters: {
    layout: "fullscreen",
  },
};

type Story = StoryObj<typeof Footer>;

export const Basic: Story = {};

export default meta;
