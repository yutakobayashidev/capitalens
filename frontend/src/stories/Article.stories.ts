import Footer from "@src/app/group/Article";
import type { Meta, StoryObj } from "@storybook/react";

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
      id: "1",
      title: "Rick Astley - Never Gonna Give You Up (Official Music Video)",
      isoDate: "2009-10-25",
      link: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      member: {
        id: "test",
        name: "Rick Astley",
        image:
          "https://yt3.googleusercontent.com/BbWaWU-qyR5nfxxXclxsI8zepppYL5x1agIPGfRdXFm5fPEewDsRRWg4x6P6fdKNhj84GoUpUI4=s176-c-k-c0x00ffffff-no-rj",
      },
      ogImageURL: "http://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
    },
  },
};

export default meta;
