import { PrismaClient } from "@prisma/client";
import ogs from "open-graph-scraper";
import Parser from "rss-parser";

const prisma = new PrismaClient();
const parser = new Parser();

type FeedItem = {
  title: string;
  contentSnippet?: string;
  dateMiliSeconds: number;
  isoDate?: string;
  link: string;
  ogImageURL: string;
};

async function getOgImageURL(url?: string) {
  if (!url) {
    return null;
  }

  const data = await ogs({ url });

  if (data.result?.ogImage && data.result.ogImage.length > 0) {
    return data.result.ogImage[0].url;
  } else {
    return null;
  }
}

async function fetchFeedItems(url: string) {
  const feed = await parser.parseURL(url);

  if (!feed?.items?.length) return [];

  const feedItems = await Promise.all(
    feed.items.map(async ({ title, contentSnippet, isoDate, link }) => {
      let ogImageURL = null;
      try {
        ogImageURL = await getOgImageURL(link);
      } catch (error) {
        console.error(`Error getting OG image for link: ${link}`);
        console.error(error);
      }

      return {
        title,
        contentSnippet: contentSnippet?.replace(/\n/g, ""),
        dateMiliSeconds: isoDate ? new Date(isoDate).getTime() : 0,
        isoDate,
        link,
        ogImageURL: ogImageURL,
      };
    })
  );
  return feedItems.filter(({ title, link }) => title && link) as FeedItem[];
}

(async function () {
  const members = await prisma.member.findMany({
    select: {
      id: true,
      feed: true,
    },
    where: {
      feed: {
        not: null, // Exclude records where feed is null
      },
      NOT: {
        feed: "", // Exclude records where feed is an empty string
      },
    },
  });

  for (const member of members) {
    if (member.feed !== null) {
      try {
        const items = await fetchFeedItems(member.feed);

        const createManyResult = await prisma.timeline.createMany({
          data: items.map((item) => ({
            title: item.title,
            contentSnippet: item.contentSnippet,
            dateMiliSeconds: item.dateMiliSeconds,
            isoDate: item.isoDate,
            link: item.link,
            memberId: member.id,
            ogImageURL: item.ogImageURL,
          })),
        });

        console.log(createManyResult);
      } catch (error) {
        console.error(`Error parsing feed for member: ${member.feed}`);
        console.error(error);
      }
    }
  }
})();
