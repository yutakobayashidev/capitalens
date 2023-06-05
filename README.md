# capitalens

本プロジェクトは、国会での議論、提出された法案、国会議員の情報などを整理し、視覚的に表示することを目的としています。

## 技術構成

現在の技術構成は以下のようになっています。

![技術構成](./image.jpg)

フロントエンド:

- Next.js
- Tailwind CSS
- LangChain (WIP)
- face-api.js

データの受け渡し

- Prisma
- Apollo GraphQL

バックエンド:

使用している情報について、詳しくは[こちらのページ](https://capitalens.vercel.app/data)をご覧ください。

- Scrapy (参衆サイトや議員ウェブサイトのスクレイピング)
- DBpedia
