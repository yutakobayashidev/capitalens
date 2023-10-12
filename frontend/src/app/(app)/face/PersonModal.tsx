import { Member } from "@src/types/member";
import { motion, transform, useMotionValue } from "framer-motion";
import Link from "next/link";
import { useRef } from "react";
import { FaGlobe } from "react-icons/fa";

interface PersonModalProps {
  member: Member;
  onClose: () => void;
}

function MemberInfo({
  color,
  emoji,
  info,
}: {
  color: string;
  emoji: string;
  info: string;
}) {
  return (
    <div className="mb-3 flex items-center">
      <div
        style={{ backgroundColor: color }}
        className="mr-2 flex h-[55px] w-[55px] items-center justify-center rounded-full text-center text-2xl shadow"
      >
        <span>{emoji}</span>
      </div>
      <div className="font-semibold">{info}</div>
    </div>
  );
}

const fast = { damping: 120, stiffness: 2000, type: "spring" };

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
    info: { offset: { y: number }; velocity: { y: number } }
  ) => {
    const { offset, velocity } = info;
    const { height } = panel.current
      ? panel.current.getBoundingClientRect()
      : { height: 0 };
    const shouldClose = velocity.y > 20 || offset.y > height / 2;
    if (shouldClose) onClose();
  };

  return (
    <>
      <motion.div
        className="black-rgba fixed inset-0"
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
        className="xs:p-8 rounded-t-4xl fixed bottom-0 left-[50%] z-50 flex w-full max-w-[480px] flex-col bg-white px-5 py-7 before:absolute before:left-[50%] before:top-[10px] before:h-[4px] before:w-[60px] before:-translate-x-1/2 before:bg-gray-200"
      >
        <h2 className="mb-5 text-center text-2xl font-bold">
          <span className="mr-1">{member.name}</span>議員の情報
        </h2>
        <div className="mb-3 flex items-center">
          <img
            className="mr-3 h-16 w-16 rounded-full border border-gray-300 object-cover object-center"
            src={member.image ?? "/noimage.png"}
            alt={member.name}
          />
          <div>
            <h1 className="text-xl font-bold">{member.name}</h1>
            {member.group && (
              <span className="text-xs font-semibold text-gray-500">
                {member.group.name +
                  "の" +
                  (member.house === "REPRESENTATIVES" ? "衆議院" : "参議院") +
                  "議員"}
              </span>
            )}
          </div>
        </div>
        {member.abstract ? (
          <p className="mb-3 line-clamp-3 text-sm leading-normal text-gray-500">
            {member.abstract}
          </p>
        ) : (
          member.description && (
            <p className="mb-3 line-clamp-3 text-sm leading-normal text-gray-500">
              {member.description}
            </p>
          )
        )}
        <div className="mb-3 flex items-center gap-x-3">
          <Link
            href={`/members/${member.id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center rounded-full bg-gray-600 px-3 py-2 text-sm font-semibold text-white"
          >
            <FaGlobe className="mr-2 text-base" />
            詳細
          </Link>
          {member.twitter && (
            <a
              href={`https://x.com/${member.twitter}`}
              className="mr-3 inline-flex items-center rounded-full bg-gray-900 px-3 py-2 text-sm font-semibold text-white"
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
        </div>
        <h2 className="mb-3 font-bold text-gray-400">基本情報</h2>
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
