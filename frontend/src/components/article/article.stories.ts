import Article from "@src/components/article/article";
import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof Article> = {
  component: Article,
  parameters: {
    layout: "fullscreen",
  },
};

type Story = StoryObj<typeof Article>;

export const Basic: Story = {
  args: {
    item: {
      id: "1",
      title: "Rick Astley - Never Gonna Give You Up (Official Music Video)",
      isoDate: "2009-10-25",
      link: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      member: {
        id: "test",
        name: "Rick Astley",
        image:
          "https://pbs.twimg.com/profile_images/1674819030660571138/Ott-Mm9__400x400.jpg",
      },
      ogImageURL: "http://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
    },
  },
};

export default meta;
