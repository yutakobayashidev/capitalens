import Meetings from "@src/components/meetings/meetings";
import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof Meetings> = {
  component: Meetings,
  parameters: {
    layout: "fullscreen",
  },
};

type Story = StoryObj<typeof Meetings>;

export const Basic: Story = {
  args: {
    meetings: [
      {
        id: "cuid",
        date: "2023-01-01",
        house: "COUNCILLORS",
        kids: "てすと",
        meeting_name: "テスト委員会",
        summary: "テスト",
      },
    ],
  },
};

export default meta;
