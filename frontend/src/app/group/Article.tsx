import Link from "next/link";
import {
  getHostFromURL,
  getFaviconSrcFromHostname,
  formatDate,
} from "@src/helper/utils";
import { Member } from "@src/types/member";

function Article({
  item,
}: {
  item: {
    id: string;
    link: string;
    title: string;
    ogImageURL: string | null;
    isoDate: string | null;
    member: {
      id: string;
      name: string;
      image: string | null;
    };
  };
}) {
  return (
    <article
      className="rounded-2xl flex flex-col relative border border-gray-100 overflow-hidden bg-gray-50"
      key={item.id}
    >
      <a href={item.link}>
        <img
          className="w-full h-[237px] object-cover"
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
        className="flex px-5 pt-6 items-center text-sm"
        href={"/members/" + item.member.id}
      >
        <img
          className="border rounded-xl w-10 h-10 mr-3 object-cover object-center"
          src={item.member.image ?? "/noimage.png"}
          alt={item.member.name}
        />
        <div>
          <div>{item.member.name}</div>
          {item.isoDate && (
            <time className="text-gray-500 text-xs">
              {formatDate(item.isoDate)}
            </time>
          )}
        </div>
      </Link>
      <a className="px-5 py-6 flex flex-col flex-1" href={item.link}>
        <h2 className="font-bold text-2xl flex-1 line-clamp-2">{item.title}</h2>
        <div className="flex mt-3 items-center text-gray-500 text-sm">
          <img
            alt={getHostFromURL(item.link)}
            src={getFaviconSrcFromHostname(getHostFromURL(item.link))}
            className="rounded mr-2"
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
