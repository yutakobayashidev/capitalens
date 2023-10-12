import MessageItem from "@src/components/message-item/message-item";
import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof MessageItem> = {
  component: MessageItem,
  parameters: {
    layout: "fullscreen",
  },
};

type Story = StoryObj<typeof MessageItem>;

export const Basic: Story = {
  args: {
    countries: [
      {
        name: "Japan",
        code: "JP",
        emoji: "🇯🇵",
        image:
          "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/JP.svg",
        unicode: "U+1F1EF U+1F1F5",
      },
    ],
    data: {
      body: [
        {
          country_id: "JP",
          country_value: "Japan",
          date: "2022",
          indicator_id: "SP.POP.TOTL",
          indicator_value: "Population, total",
          value: 125124989,
        },
      ],
      type: "get_population",
    },
    message: {
      id: "Tm4WMTi",
      content:
        "The population of Japan is approximately 125,124,989 as of 2022.",
      role: "assistant",
    },
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
