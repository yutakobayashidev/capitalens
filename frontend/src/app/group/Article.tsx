import {
  formatDate,
  getFaviconSrcFromHostname,
  getHostFromURL,
} from "@src/helper/utils";
import Link from "next/link";

function Article({
  item,
}: {
  item: {
    id: string;
    title: string;
    isoDate: string | null;
    link: string;
    member: {
      id: string;
      name: string;
      image: string | null;
    };
    ogImageURL: string | null;
  };
}) {
  return (
    <article
      className="relative flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-gray-50"
      key={item.id}
    >
      <a href={item.link}>
        <img
          className="h-[237px] w-full object-cover"
          src={
            item.ogImageURL
              ? item.ogImageURL.endsWith(".svg")
                ? "/opengraph.jpg"
                : item.ogImageURL
              : "/opengraph.jpg"
          }
          alt={item.title}
        />
      </a>
      <Link
        className="flex items-center px-5 pt-6 text-sm"
        href={`/members/${item.member.id}`}
      >
        <img
          className="mr-3 h-10 w-10 rounded-xl border object-cover object-center"
          src={item.member.image ?? "/noimage.png"}
          alt={item.member.name}
        />
        <div>
          <div>{item.member.name}</div>
          {item.isoDate && (
            <time className="text-xs text-gray-500">
              {formatDate(item.isoDate)}
            </time>
          )}
        </div>
      </Link>
      <a className="flex flex-1 flex-col px-5 py-6" href={item.link}>
        <h2 className="line-clamp-2 flex-1 text-2xl font-bold">{item.title}</h2>
        <div className="mt-3 flex items-center text-sm text-gray-500">
          <img
            alt={getHostFromURL(item.link)}
            src={getFaviconSrcFromHostname(getHostFromURL(item.link))}
            className="mr-2 rounded"
            width={14}
            height={14}
          />
          {getHostFromURL(item.link)}
        </div>
      </a>
    </article>
  );
}

export default Article;
