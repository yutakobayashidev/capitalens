import { getHostFromURL } from "@src/helper/utils";
import { Member } from "@src/types/member";
import Link from "next/link";
import { AiOutlineLink } from "react-icons/ai";
import { FaGlobe } from "react-icons/fa";

export default function MemberCard({ member }: { member: Member }) {
  return (
    <div className="mb-5 rounded-lg border px-4 pb-2 pt-6">
      <div className="mb-4 md:flex">
        <img
          src={member.image ?? "/noimage.png"}
          className="mb-3 mr-5 rounded-lg object-cover object-center md:mb-0"
          alt={member.name}
        />
        <div>
          <h2 className="mb-1 text-2xl font-bold">{member.name}</h2>
          {member.group && (
            <div className="mb-2 text-gray-500">
              {member.group.name +
                "の" +
                (member.house === "REPRESENTATIVES" ? "衆議院" : "参議院") +
                "議員"}
            </div>
          )}
          <p className="mb-3 line-clamp-4 text-sm text-gray-600">
            {member.abstract ?? member.description}
          </p>
          <div className="flex flex-wrap items-center gap-y-2">
            <Link
              href={`/members/${member.id}`}
              className="mr-2 inline-flex items-center rounded-full bg-blue-400 px-3 py-2 text-sm font-semibold text-white"
            >
              <FaGlobe className="mr-2 text-base" />
              詳細
            </Link>
            {member.twitter && (
              <a
                href={"https://x.com/" + member.twitter}
                className="mr-2 inline-flex items-center rounded-full bg-gray-900 px-3 py-2 text-sm font-semibold text-white"
              >
                <svg
                  aria-label="X formerly known as Twitter"
                  fill="currentColor"
                  className="mx-auto mr-2 h-4 w-4"
                  viewBox="0 0 22 20"
                >
                  <path d="M16.99 0H20.298L13.071 8.26L21.573 19.5H14.916L9.702 12.683L3.736 19.5H0.426L8.156 10.665L0 0H6.826L11.539 6.231L16.99 0ZM15.829 17.52H17.662L5.83 1.876H3.863L15.829 17.52Z"></path>
                </svg>
                @{member.twitter}
              </a>
            )}
            {member.website && (
              <a
                href={member.website}
                className="inline-flex items-center rounded-full bg-gray-400 px-3 py-2 text-sm font-semibold text-white"
              >
                <AiOutlineLink
                  aria-label="Web site"
                  className="mr-2 text-base"
                />
                {getHostFromURL(member.website)}
              </a>
            )}
          </div>
        </div>
      </div>
      {member.abstract && (
        <div className="mb-2 text-xs text-gray-500">
          {member.wikipedia ? (
            <a
              className="text-primary font-medium hover:underline"
              href={member.wikipedia}
            >
              ウィキペディアの項目
            </a>
          ) : (
            <span className="font-medium">Wikipediaの項目</span>
          )}
          を
          <a
            className="text-primary font-medium hover:underline"
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
