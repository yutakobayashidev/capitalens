import { Member } from "@src/types/member";
import Link from "next/link";
import { FaTwitter, FaGlobe } from "react-icons/fa";
import { useRef } from "react";
import { motion, transform, useMotionValue } from "framer-motion";

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

const fast = { type: "spring", stiffness: 2000, damping: 120 };

const PersonModal: React.FC<PersonModalProps> = ({ member, onClose }) => {
  const panel = useRef<HTMLDivElement>(null);
  const opacity = useMotionValue(0);

  const handleUpdate = (latest: { y: number | string }) => {
    if (typeof latest.y === "string") return;
    const { height } = panel.current
      ? panel.current.getBoundingClientRect()
      : { height: 0 };
    const progress = transform(latest.y, [0, height], [1, 0]);
    opacity.set(progress);
  };

  const handleDragEnd = (
    _: any,
    info: { velocity: { y: number }; offset: { y: number } }
  ) => {
    const { velocity, offset } = info;
    const { height } = panel.current
      ? panel.current.getBoundingClientRect()
      : { height: 0 };
    const shouldClose = velocity.y > 20 || offset.y > height / 2;
    if (shouldClose) onClose();
  };

  return (
    <>
      <motion.div
        className="black-rgba inset-0 fixed"
        style={{ opacity }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        onClick={onClose}
      />
      <motion.div
        ref={panel}
        transition={fast}
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "120%" }}
        onDragEnd={handleDragEnd}
        onUpdate={handleUpdate}
        dragElastic={0.05}
        dragConstraints={{ top: 0 }}
        drag="y"
        style={{ x: "-50%" }}
        className="content before:bg-gray-200 before:h-[4px] before:left-[50%] left-[50%] before:absolute before:w-[60px] before:top-[10px] before:transform before:-translate-x-1/2 px-5 py-7 xs:p-8 bg-white max-w-[480px] bottom-0 flex flex-col fixed w-full z-50 rounded-t-4xl"
      >
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
            {member.group && (
              <span className="text-gray-500 text-xs font-semibold">
                {member.group.name +
                  "の" +
                  (member.house === "REPRESENTATIVES" ? "衆議院" : "参議院") +
                  "議員"}
              </span>
            )}
          </div>
        </div>
        {member.abstract ? (
          <p className="text-gray-500 text-sm leading-normal line-clamp-3 mb-3">
            {member.abstract}
          </p>
        ) : (
          member.description && (
            <p className="text-gray-500 text-sm leading-normal line-clamp-3 mb-3">
              {member.description}
            </p>
          )
        )}
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
            <a
              href={"https://twitter.com/" + member.twitter}
              className="bg-[#1da1f2] mr-3 text-sm items-center font-semibold rounded-full py-2 px-3 text-white inline-flex"
            >
              <FaTwitter className="mr-2 text-base" />@{member.twitter}
            </a>
          )}
        </div>
        <h2 className="text-gray-400 font-bold mb-3">基本情報</h2>
        {member.group && (
          <MemberInfo emoji="🏛️" info={member.group.name} color="#dbeafe" />
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
      </motion.div>
    </>
  );
};

export default PersonModal;
