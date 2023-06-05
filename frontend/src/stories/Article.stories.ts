import type { Meta, StoryObj } from "@storybook/react";
import Footer from "@src/app/group/Article";

const meta: Meta<typeof Footer> = {
  component: Footer,
  parameters: {
    layout: "fullscreen",
  },
};

type Story = StoryObj<typeof Footer>;

export const Basic: Story = {
  args: {
    item: {
      title: "Rick Astley - Never Gonna Give You Up (Official Music Video)",
      id: "1",
      link: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      isoDate: "2009-10-25",
      ogImageURL: "http://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
      member: {
        id: "test",
        name: "Rick Astley",
        image:
          "https://yt3.googleusercontent.com/BbWaWU-qyR5nfxxXclxsI8zepppYL5x1agIPGfRdXFm5fPEewDsRRWg4x6P6fdKNhj84GoUpUI4=s176-c-k-c0x00ffffff-no-rj",
      },
    },
  },
};

export default meta;
