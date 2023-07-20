import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const prefectures = [
    "北海道",
    "青森県",
    "岩手県",
    "宮城県",
    "秋田県",
    "山形県",
    "福島県",
    "茨城県",
    "栃木県",
    "群馬県",
    "埼玉県",
    "千葉県",
    "東京都",
    "神奈川県",
    "新潟県",
    "富山県",
    "石川県",
    "福井県",
    "山梨県",
    "長野県",
    "岐阜県",
    "静岡県",
    "愛知県",
    "三重県",
    "滋賀県",
    "京都府",
    "大阪府",
    "兵庫県",
    "奈良県",
    "和歌山県",
    "鳥取県",
    "島根県",
    "岡山県",
    "広島県",
    "山口県",
    "徳島県",
    "香川県",
    "愛媛県",
    "高知県",
    "福岡県",
    "佐賀県",
    "長崎県",
    "熊本県",
    "大分県",
    "宮崎県",
    "鹿児島県",
    "沖縄県",
  ];

  const groups = [
    {
      id: "JIMIN",
      name: "自由民主党",
      description:
        "自由民主党（じゆうみんしゅとう、英: Liberal Democratic Party、英文略称: LDP[ / Lib Dems）は、日本の政党。自由主義を掲げ、つねに改革を進める保守政党を標榜している。",
      facebook: "jimin.official",
      image:
        "https://pbs.twimg.com/profile_images/1532645750521606145/CQPpEZtc_400x400.jpg",
      twitter: "jimin_koho",
      website: "https://www.jimin.jp/",
      wikipedia:
        "https://ja.wikipedia.org/wiki/%E8%87%AA%E7%94%B1%E6%B0%91%E4%B8%BB%E5%85%9A_(%E6%97%A5%E6%9C%AC)",
    },
    {
      id: "RIKKEN",
      name: "立憲民主党",
      description:
        "立憲民主党（りっけんみんしゅとう、英: The Constitutional Democratic Party of Japan、略称: CDP）は、日本の政党。立憲主義に基づく民主政治を綱領に掲げる、リベラル政党である。",
      facebook: "rikkenminshu",
      image:
        "https://pbs.twimg.com/profile_images/1311187310852022272/8TOEuyf-_400x400.jpg",
      twitter: "CDP2017",
      website: "https://cdp-japan.jp/",
      wikipedia:
        "https://ja.wikipedia.org/wiki/%E7%AB%8B%E6%86%B2%E6%B0%91%E4%B8%BB%E5%85%9A_(%E6%97%A5%E6%9C%AC_2020)",
    },
    {
      id: "KOMEI",
      name: "公明党",
      description:
        "公明党は、日本の政党。宗教団体の創価学会を支持母体として中道政治の実現を目指して結成された。 略称は公明。1字表記の際は公。現在の党キャッチコピーは、「小さな声を、聴く力。」。 1999年10月5日から2009年9月16日まで、および2012年12月26日から現在まで自由民主党と自公連立政権を構成している。",
      facebook: "komeito",
      image:
        "https://pbs.twimg.com/profile_images/1371640641873084417/vQuhD0GE_400x400.jpg",
      twitter: "komei_koho",
      website: "https://www.komei.or.jp/",
      wikipedia:
        "https://ja.wikipedia.org/wiki/%E5%85%AC%E6%98%8E%E5%85%9A#:~:text=%E5%85%AC%E6%98%8E%E5%85%9A%E3%81%AF%E3%80%81%E8%B1%8A%E3%81%8B%E3%81%AA%E3%82%8B%E4%BA%BA%E9%96%93,%E3%81%AE%E5%A4%A7%E8%A1%86%E6%94%BF%E5%85%9A%E3%81%A7%E3%81%82%E3%82%8B%E3%80%82",
    },
    {
      id: "KYOSAN",
      name: "日本共産党",
      description:
        "日本共産党は、日本の政党。科学的社会主義を理論的基礎とする社会主義・共産主義政党である。 略称は「JCP」。日本国内では単に「共産党」、「共産」と呼ばれる。「日共」とも。1字表記の際は、「共」と表記される。",
      facebook: "kyosanto",
      image:
        "https://pbs.twimg.com/profile_images/920124778182144000/2NzWLV_Q_400x400.jpg",
      twitter: "jcp_cc",
      website: "https://www.jcp.or.jp",
      wikipedia:
        "https://ja.wikipedia.org/wiki/%E6%97%A5%E6%9C%AC%E5%85%B1%E7%94%A3%E5%85%9A",
    },
    {
      id: "ISHIN",
      name: "日本維新の会",
      description:
        "日本維新の会は、日本の政党。行政改革や憲法改正、規制改革、機会平等、地方分権などを政策に掲げる保守政党である 。 略称は「維新」、1字表記は「維」。 自公連立政権に対しては、是々非々の立場を取っている。そのため、立憲民主党をはじめとするいわゆる野党共闘とは距離を置いており、これらの野党を批判することも多い。",
      facebook: "nipponishinnokai",
      image:
        "https://pbs.twimg.com/profile_images/919020416076677120/yaugkUxG_400x400.jpg",
      twitter: "osaka_ishin",
      website: "https://o-ishin.jp",
      wikipedia:
        "https://ja.wikipedia.org/wiki/%E6%97%A5%E6%9C%AC%E7%B6%AD%E6%96%B0%E3%81%AE%E4%BC%9A_(2016-)",
    },
    {
      id: "KOKUMIN",
      name: "国民民主党",
      description:
        "国民民主党は、日本の政党。穏健保守からリベラルまでを包摂する中道政党である。 公職選挙法における略称は「民主党」。マスメディアでは、「国民民主」、「国民」。 旧・立憲民主党と旧・国民民主党の合流の際に、玉木雄一郎らを中心とする合流に参加しない国民民主党の一部の議員により2020年に結党された。",
      facebook: "democratic.party.for.the.people",
      image:
        "https://pbs.twimg.com/profile_images/1060713235500814337/hNsdccnL_400x400.jpg",
      twitter: "DPFPnews",
      website: "https://new-kokumin.jp",
    },
    {
      id: "REIWA",
      name: "れいわ新選組",
      description:
        "れいわ新選組は、日本の政党。略称はれいわ。 2019年4月1日に元俳優で当時参議院議員であった山本太郎が設立した政党である。 同年7月の第25回参議院議員選挙比例区で得票率2％を上回り、設立から約3か月半で公職選挙法が規定する政党要件を満たした。",
      facebook: "reiwa.shinsengumi",
      image:
        "https://pbs.twimg.com/profile_images/1326482970765484032/YHpERFmF_400x400.jpg",
      twitter: "reiwashinsen",
      website: "https://reiwa-shinsengumi.com",
    },
  ];

  for (const group of groups) {
    await prisma.group.upsert({
      create: {
        id: group.id as any,
        name: group.name,
        description: group.description,
        facebook: group.facebook,
        image: group.image,
        twitter: group.twitter,
        website: group.website,
        wikipedia: group.wikipedia,
      },
      update: {
        id: group.id as any,
        name: group.name,
        description: group.description,
        facebook: group.facebook,
        image: group.image,
        twitter: group.twitter,
        website: group.website,
        wikipedia: group.wikipedia,
      },
      where: { id: group.id as any },
    });
  }

  for (const name of prefectures) {
    await prisma.prefecture.create({
      data: {
        name,
      },
    });
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
