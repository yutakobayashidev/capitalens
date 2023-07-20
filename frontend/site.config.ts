export const config = {
  siteMeta: {
    title: "CapitaLens",
    description:
      "本プロジェクトは、国会での議論、提出された法案、国会議員の情報などを整理し、視覚的に表示することを目的としています。",
  },
  siteRoot:
    process.env.NODE_ENV === "production"
      ? "https://capitalens.vercel.app/"
      : "http://localhost:3000/",
  SocialLinks: {
    discord: "https://discord.gg/tcc5AvRSr9",
    github: "https://github.com/yutakobayashidev/capitalens",
  },
};
