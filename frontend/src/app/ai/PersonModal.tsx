import { People } from "@src/types/people";
import Link from "next/link";

interface PersonModalProps {
  people: People;
  onClose: () => void;
}

const PersonModal: React.FC<PersonModalProps> = ({ people, onClose }) => {
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
              <span className="mr-1">{people.name}</span>議員の情報
            </h2>
            <div className="flex items-center mb-3">
              <img
                className="rounded-full border border-gray-300 w-16 h-16 mr-3 object-cover object-center"
                src={people.image}
                alt={people.name}
              />
              <div>
                <h1 className="font-bold text-xl">{people.name}</h1>
                <p className="text-gray-400 text-sm">{people.role}</p>
              </div>
            </div>
            <p className="text-gray-500 text-sm leading-normal line-clamp-4 mb-3">
              {people.description}
            </p>
            <Link
              className="mb-5 block text-[#0f41af] text-sm"
              href={`/people/${people.id}`}
            >
              情報を詳しく見る -&gt;
            </Link>
            <h2 className="text-gray-400 font-bold mb-3">基本情報</h2>
            <div className="flex items-center mb-3">
              <div className="w-[55px] h-[55px] shadow mr-2 flex justify-center items-center bg-orange-100 text-2xl rounded-full text-center">
                <span>📱</span>
              </div>
              <div className="font-semibold">
                {people.scannedCount}回のスキャン
              </div>
            </div>
            {people.group && (
              <div className="flex items-center mb-3">
                <div className="w-[55px] h-[55px] shadow mr-2 flex justify-center items-center bg-blue-100 text-2xl rounded-full text-center">
                  <span>🏛️</span>
                </div>
                <div className="font-semibold">{people.group}</div>
              </div>
            )}
            {people.win && (
              <div className="flex items-center mb-3">
                <div className="w-[55px] h-[55px] shadow mr-2 flex justify-center items-center bg-red-200 text-2xl rounded-full text-center">
                  <span>🎉</span>
                </div>
                <div className="font-semibold">{people.win}回の当選</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonModal;
