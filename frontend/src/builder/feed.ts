import { PrismaClient } from "@prisma/client";
import Parser from "rss-parser";
import ogs from "open-graph-scraper";

const prisma = new PrismaClient();
const parser = new Parser();

type FeedItem = {
  title: string;
  link: string;
  contentSnippet?: string;
  isoDate?: string;
  dateMiliSeconds: number;
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
    feed.items.map(async ({ title, contentSnippet, link, isoDate }) => {
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
        link,
        isoDate,
        dateMiliSeconds: isoDate ? new Date(isoDate).getTime() : 0,
        ogImageURL: ogImageURL,
      };
    })
  );
  return feedItems.filter(({ title, link }) => title && link) as FeedItem[];
}

(async function () {
  const members = await prisma.member.findMany({
    where: {
      feed: {
        not: null, // Exclude records where feed is null
      },
      NOT: {
        feed: "", // Exclude records where feed is an empty string
      },
    },
    select: {
      feed: true,
      id: true,
    },
  });

  for (const member of members) {
    if (member.feed !== null) {
      try {
        const items = await fetchFeedItems(member.feed);

        const createManyResult = await prisma.timeline.createMany({
          data: items.map((item) => ({
            title: item.title,
            link: item.link,
            isoDate: item.isoDate,
            dateMiliSeconds: item.dateMiliSeconds,
            contentSnippet: item.contentSnippet,
            ogImageURL: item.ogImageURL,
            memberId: member.id,
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
