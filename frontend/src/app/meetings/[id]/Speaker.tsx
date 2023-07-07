import { getHostFromURL } from "@src/helper/utils";
import { Member } from "@src/types/member";
import Link from "next/link";
import { AiOutlineLink } from "react-icons/ai";
import { FaGlobe,FaTwitter } from "react-icons/fa";

export default function Speaker({
  currentSpeaker,
  speakerInfo,
}: {
  currentSpeaker: Member;
  speakerInfo: string | null;
}) {
  return (
    <div className="mb-5 rounded-lg border px-4 pb-2 pt-6">
      <div className="mb-4 md:flex">
        <img
          src={currentSpeaker.image ?? "/noimage.png"}
          className="mb-3 mr-5 rounded-lg object-cover object-center md:mb-0"
          alt={currentSpeaker.name}
        />
        <div>
          <h2 className="mb-1 text-2xl font-bold">{currentSpeaker.name}</h2>
          {currentSpeaker.group ? (
            <div className="mb-2 text-gray-500">
              {currentSpeaker.group.name +
                "の" +
                (currentSpeaker.house === "REPRESENTATIVES"
                  ? "衆議院"
                  : "参議院") +
                "議員"}
            </div>
          ) : (
            <div className="mb-2 text-gray-500">{speakerInfo}</div>
          )}
          <p className="mb-3 line-clamp-4 text-sm text-gray-600">
            {currentSpeaker.abstract ?? currentSpeaker.description}
          </p>
          <div className="flex flex-wrap items-center gap-y-2">
            <Link
              href={`/members/${currentSpeaker.id}`}
              className="mr-2 inline-flex items-center rounded-full bg-gray-600 px-3 py-2 text-sm font-semibold text-white"
            >
              <FaGlobe className="mr-2 text-base" />
              詳細
            </Link>
            {currentSpeaker.twitter && (
              <a
                href={"https://twitter.com/" + currentSpeaker.twitter}
                className="mr-2 inline-flex items-center rounded-full bg-[#1da1f2] px-3 py-2 text-sm font-semibold text-white"
              >
                <FaTwitter className="mr-2 text-base" />@
                {currentSpeaker.twitter}
              </a>
            )}
            {currentSpeaker.website && (
              <a
                href={currentSpeaker.website}
                className="inline-flex items-center rounded-full bg-gray-400 px-3 py-2 text-sm font-semibold text-white"
              >
                <AiOutlineLink className="mr-2 text-base" />
                {getHostFromURL(currentSpeaker.website)}
              </a>
            )}
          </div>
        </div>
      </div>
      {currentSpeaker.abstract && (
        <div className="mb-2 text-xs text-gray-500">
          {currentSpeaker.wikipedia ? (
            <a
              className="font-medium text-primary hover:underline"
              href={currentSpeaker.wikipedia}
            >
              ウィキペディアの項目
            </a>
          ) : (
            <span className="font-medium">Wikipediaの項目</span>
          )}
          を
          <a
            className="font-medium text-primary hover:underline"
            href="https://creativecommons.org/licenses/by-sa/3.0/deed.ja"
          >
            Creative Commons Attribution (CC BY-SA 3.0)
          </a>
          に基づき二次利用しています。
        </div>
      )}
    </div>
  );
}
