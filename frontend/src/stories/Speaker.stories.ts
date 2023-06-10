import type { Meta, StoryObj } from "@storybook/react";
import Speaker from "@src/app/meetings/[id]/Speaker";
const meta: Meta<typeof Speaker> = {
  component: Speaker,
  parameters: {
    layout: "fullscreen",
  },
};

type Story = StoryObj<typeof Speaker>;

export const Basic: Story = {
  args: {
    currentSpeaker: {
      id: "1",
      scannedCount: 0,
      name: "岸田文雄",
      win: 1,
      youtube: "kishidafumio230",
      twitter: "kishida230",
      birthplace: "1957-07-29",
      house: "REPRESENTATIVES",
      group: {
        name: "自由民主党",
        image:
          "https://pbs.twimg.com/profile_images/1532645750521606145/CQPpEZtc_400x400.jpg",
      },
      wikipedia:
        "https://ja.wikipedia.org/wiki/%E5%B2%B8%E7%94%B0%E6%96%87%E9%9B%84",
      website: "https://kishida.gr.jp",
      image:
        "https://www.shugiin.go.jp/internet/itdb_giinprof.nsf/html/profile/154.jpg/$File/154.jpg",
      description:
        "小選挙区（広島県第一区）選出、自由民主党・無所属の会内閣総理大臣昭和三十二年七月東京都渋谷区に生る、早稲田大学法学部卒業○(株)日本長期信用銀行行員、衆議院議員秘書○建設政務次官、文部科学副大臣、内閣府特命担当大臣（沖縄北方対策・科学技術・国民生活・規制改革）、消費者行政推進担当大臣、宇宙開発担当大臣、外務大臣、防衛大臣、内閣総理大臣○衆議院議院運営委員会理事、同消費者問題に関する特別委員会筆頭理事、同文部科学委員会筆頭理事、同国土交通委員会筆頭理事、同国家基本政策委員会筆頭理事、同厚生労働委員長○自由民主党青年局長、同政務調査会商工部会長、同消費者問題調査会長、同副幹事長、同経理局長、同団体総局長、同選挙対策局長代理、同広島県支部連合会会長、同国会対策委員長、同政務調査会長、同総裁○宏池会会長○当選十回（40 41 42 43 44 45 46 47 48 49）（令和5年2月13日現在）",
      abstract:
        "岸田 文雄（きしだ ふみお、1957年〈昭和32年〉7月29日 - ）は、日本の政治家。自由民主党所属の衆議院議員（10期）、内閣総理大臣（第100代・第101代）、自由民主党総裁（第27代）、宏池会会長（第9代）",
    },
  },
};

export default meta;
