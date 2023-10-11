import Notes from "@src/components/notes/notes";
import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof Notes> = {
  component: Notes,
  parameters: {
    layout: "fullscreen",
  },
};

type Story = StoryObj<typeof Notes>;

export const Basic: Story = {
  args: {
    note: {
      end: 2,
      start: 1,
      text: "マイナンバーカード関連サービスの誤登録等の事案について、ご自身での確認方法やご質問・ご不安にお答えします。マイナンバー総合フリーダイヤル（0120-95-0178）でも受け付けております",
    },
  },
};

export default meta;
