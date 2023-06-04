import Link from "next/link";
import { FaTwitter, FaGlobe } from "react-icons/fa";
import { Member } from "@src/types/member";
import { AiOutlineLink } from "react-icons/ai";
import { getHostFromURL } from "@src/helper/utils";

export default function Speaker({
  currentSpeaker,
}: {
  currentSpeaker: Member;
}) {
  return (
    <div className="rounded-lg border mb-5 px-4 pt-6 pb-2">
      <div className="md:flex mb-4">
        <img
          src={currentSpeaker.image ?? "/noimage.png"}
          className="mr-5 rounded-lg mb-3 md:mb-0 object-cover object-center"
          alt={currentSpeaker.name}
        />
        <div>
          <h2 className="text-2xl font-bold mb-1">{currentSpeaker.name}</h2>
          {currentSpeaker.group && (
            <div className="text-gray-500 mb-2">
              {currentSpeaker.group.name +
                "の" +
                (currentSpeaker.house === "REPRESENTATIVES"
                  ? "衆議院"
                  : "参議院") +
                "議員"}
            </div>
          )}
          <p className="mb-3 text-sm text-gray-600 line-clamp-4">
            {currentSpeaker.abstract ?? currentSpeaker.description}
          </p>
          <div>
            <Link
              href={`/members/${currentSpeaker.id}`}
              className="mr-2 bg-gray-600 text-sm items-center font-semibold rounded-full py-2 px-3 text-white inline-flex"
            >
              <FaGlobe className="mr-2 text-base" />
              詳細
            </Link>
            {currentSpeaker.twitter && (
              <a
                href={"https://twitter.com/" + currentSpeaker.twitter}
                className="bg-[#1da1f2] mr-2 text-sm items-center font-semibold rounded-full py-2 px-3 text-white inline-flex"
              >
                <FaTwitter className="mr-2 text-base" />@
                {currentSpeaker.twitter}
              </a>
            )}
            {currentSpeaker.website && (
              <a
                href={currentSpeaker.website}
                className="text-sm bg-gray-400 items-center font-semibold rounded-full py-2 px-3 text-white inline-flex"
              >
                <AiOutlineLink className="mr-2 text-base" />
                {getHostFromURL(currentSpeaker.website)}
              </a>
            )}
          </div>
        </div>
      </div>
      {currentSpeaker.abstract && (
        <div className="text-xs text-gray-500 mb-2">
          {currentSpeaker.wikipedia ? (
            <a
              className="text-primary hover:underline font-medium"
              href={currentSpeaker.wikipedia}
            >
              Wikipediaの項目
            </a>
          ) : (
            <span className="font-medium">Wikipediaの項目</span>
          )}
          を
          <a
            className="text-primary hover:underline font-medium"
            href="https://creativecommons.org/licenses/by-sa/4.0/legalcode"
          >
            Creative Commons Attribution (CC BY-SA 4.0)
          </a>
          に基づき二次利用しています。
        </div>
      )}
    </div>
  );
}
