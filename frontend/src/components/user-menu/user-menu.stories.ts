import UserMenu from "@src/components/user-menu/user-menu";
import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof UserMenu> = {
  component: UserMenu,
  parameters: {
    layout: "fullscreen",
  },
};

type Story = StoryObj<typeof UserMenu>;

export const Basic: Story = {
  args: {
    user: {
      id: "cuid",
      name: "John Doe",
      createdAt: "2023-10-11T18:32:56.263Z",
      email: "email@example.com",
      image: "https://avatars.githubusercontent.com/u/9919?s=200&v=4",
      kids: false,
      prefectureId: null,
      updatedAt: "2023-10-11T18:32:56.263Z",
    },
  },
};

export default meta;
