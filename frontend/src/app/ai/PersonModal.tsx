import { Member } from "@src/types/member";
import Link from "next/link";
import { FaTwitter, FaGlobe } from "react-icons/fa";

interface PersonModalProps {
  member: Member;
  onClose: () => void;
}

function MemberInfo({
  emoji,
  info,
  color,
}: {
  emoji: string;
  info: string;
  color: string;
}) {
  return (
    <div className="flex items-center mb-3">
      <div
        style={{ backgroundColor: color }}
        className="w-[55px] h-[55px] shadow mr-2 flex justify-center items-center text-2xl rounded-full text-center"
      >
        <span>{emoji}</span>
      </div>
      <div className="font-semibold">{info}</div>
    </div>
  );
}

const PersonModal: React.FC<PersonModalProps> = ({ member, onClose }) => {
  return (
    <div>
      <div
        draggable="false"
        onClick={onClose}
        aria-label="モーダルを閉じる"
        className="fixed inset-0 flex items-center justify-center bg-black/10 backdrop-blur-[3px] z-modal"
      ></div>
      <div className="h-100dvh pointer-events-none fixed inset-0 z-50 flex w-full overflow-hidden overscroll-none">
        <div className="pointer-events-auto relative mx-auto mt-auto mb-0 max-h-[calc(100dvh-54px)] w-full overflow-y-auto rounded-t-4xl bg-white pb-4 shadow-2xl transition-all duration-500 xs:p-0 sm:mb-auto sm:w-[560px] sm:rounded-3xl">
          <div className="px-5 py-7 xs:p-8">
            <h2 className="text-center font-bold text-2xl mb-5">
              <span className="mr-1">{member.name}</span>議員の情報
            </h2>
            <div className="flex items-center mb-3">
              <img
                className="rounded-full border border-gray-300 w-16 h-16 mr-3 object-cover object-center"
                src={member.image ?? "/noimage.png"}
                alt={member.name}
              />
              <div>
                <h1 className="font-bold text-xl">{member.name}</h1>
                <span className="text-gray-500 text-xs font-semibold">
                  {member.house == "REPRESENTATIVES"
                    ? member.group + "の" + "衆議院議員"
                    : "参議院議員"}
                </span>
              </div>
            </div>
            <p className="text-gray-500 text-sm leading-normal line-clamp-3 mb-3">
              {member.description}
            </p>
            <div className="mb-3">
              <Link
                href={`/members/${member.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mr-3 bg-gray-600 text-sm items-center font-semibold rounded-full py-2 px-3 text-white inline-flex"
              >
                <FaGlobe className="mr-2 text-base" />
                詳細
              </Link>
              {member.twitter && (
                <a className="bg-[#1da1f2] mr-3 text-sm items-center font-semibold rounded-full py-2 px-3 text-white inline-flex">
                  <FaTwitter className="mr-2 text-base" />@{member.twitter}
                </a>
              )}
            </div>
            <h2 className="text-gray-400 font-bold mb-3">基本情報</h2>
            {member.group && (
              <MemberInfo emoji="🏛️" info={member.group} color="#dbeafe" />
            )}
            {member.win && (
              <MemberInfo
                emoji="🎉"
                info={`${member.win}回の当選`}
                color="#FECACA"
              />
            )}
            {member.birthplace && (
              <MemberInfo
                emoji="🌏"
                info={`${member.birthplace}出身`}
                color="#bbf7d0"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonModal;
