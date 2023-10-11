import Population from "@src/components/population/population";
import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof Population> = {
  component: Population,
  parameters: {
    layout: "fullscreen",
  },
};

type Story = StoryObj<typeof Population>;

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
    transformedData: [
      {
        country_id: "JP",
        country_value: "Japan",
        date: "2022",
        indicator_id: "SP.POP.TOTL",
        indicator_value: "Population, total",
        value: 125124989,
      },
    ],
  },
};

export default meta;
