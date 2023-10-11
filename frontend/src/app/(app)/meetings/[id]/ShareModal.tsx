import { Dialog } from "@headlessui/react";
import { config } from "@site.config";
import Modal from "@src/components/ui/dialog";
import { Meeting } from "@src/types/meeting";
import { FC, ReactNode, useState } from "react";
import { BsLine } from "react-icons/bs";
import { FaFacebook } from "react-icons/fa";
import { SiHatenabookmark } from "react-icons/si";
import { toast } from "sonner";

interface ShareButtonProps {
  bgColor: string;
  children: ReactNode;
  href: string;
}

const ShareButton: FC<ShareButtonProps> = ({ bgColor, children, href }) => (
  <a
    href={href}
    target="_blank"
    rel="nofollow noopener noreferrer"
    className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-full text-sm font-semibold text-white md:inline-flex ${bgColor}`}
  >
    {children}
  </a>
);

export default function ShareModal({
  currentShareTime,
  handleBlur,
  handleChange,
  inputValue,
  isShareModalOpen,
  meeting,
  setIsShareOpen,
}: {
  currentShareTime: number;
  handleBlur: () => void;
  handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void; // Define the correct type for this prop
  inputValue: string;
  isShareModalOpen: boolean;
  meeting: Meeting;
  setIsShareOpen: (value: boolean) => void;
}) {
  const url = `${config.siteRoot}meetings/${meeting.id}`;

  const MAX_TWEET_LENGTH = 140;
  const TWITTER_SHORTENED_URL_LENGTH = 23;
  const ellipsis = "...";

  const baseText = `${meeting.house === "COUNCILLORS" ? "参議院" : "衆議院"} ${
    meeting.meeting_name
  }\n\n`;

  const [isTime, setIsTime] = useState(true);

  const handleTime = () => {
    setIsTime(!isTime);
  };

  const copyLink = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success("クリップボードにコピーしました");
    } catch (err) {
      toast.error("リンクのコピーに失敗しました");
    }
  };

  const truncateSummary = (summary: string, maxChars: number): string =>
    summary.length > maxChars
      ? summary.slice(0, maxChars - ellipsis.length) + ellipsis
      : summary;

  const xUrl = `https://x.com/intent/tweet?text=${encodeURIComponent(
    baseText +
      truncateSummary(
        meeting.summary || "",
        MAX_TWEET_LENGTH - baseText.length - TWITTER_SHORTENED_URL_LENGTH
      )
  )}&url=${url}${isTime ? `?t=${Math.floor(currentShareTime)}` : ""}`;

  const facebookUrl = `http://www.facebook.com/share.php?u=${encodeURIComponent(
    url + (isTime ? `?t=${Math.floor(currentShareTime)}` : "")
  )}`;

  const hatenaUrl = `https://b.hatena.ne.jp/entry/panel/?url=${url}${
    isTime ? `?t=${Math.floor(currentShareTime)}` : ""
  }&btitle=${encodeURIComponent(baseText)}`;

  const lineUrl = `https://social-plugins.line.me/lineit/share?url=${url}${
    isTime ? `?t=${Math.floor(currentShareTime)}` : null
  }&text=${encodeURIComponent(baseText)}`;

  const linkValue = `${url}${
    isTime ? `?t=${Math.floor(currentShareTime)}` : ""
  }`;

  return (
    <Modal isOpen={isShareModalOpen} setIsOpen={setIsShareOpen}>
      <Dialog.Panel className="z-50 w-full max-w-xl overflow-hidden rounded-xl bg-white p-10 align-middle shadow-xl transition-all">
        <div className="mb-6 text-center text-3xl font-bold">
          この会議をシェアする
        </div>
        <div className="hidden-scrollbar flex items-center gap-x-5 overflow-x-auto md:justify-center">
          <ShareButton href={xUrl} bgColor="bg-gray-900">
            <svg
              aria-label="X formerly known as Twitter"
              fill="currentColor"
              className="mx-auto h-6 w-6"
              viewBox="0 0 22 20"
            >
              <path d="M16.99 0H20.298L13.071 8.26L21.573 19.5H14.916L9.702 12.683L3.736 19.5H0.426L8.156 10.665L0 0H6.826L11.539 6.231L16.99 0ZM15.829 17.52H17.662L5.83 1.876H3.863L15.829 17.52Z"></path>
            </svg>
          </ShareButton>
          <ShareButton href={facebookUrl} bgColor="bg-[#3b5998]">
            <FaFacebook className="h-7 w-7 text-white" />
          </ShareButton>
          <ShareButton href={hatenaUrl} bgColor="bg-[#01a5df]">
            <SiHatenabookmark className="h-7 w-7 text-white" />
          </ShareButton>
          <ShareButton href={lineUrl} bgColor="bg-[#06C755]">
            <BsLine className="h-7 w-7 text-white" />
          </ShareButton>
        </div>
        <div className="mt-6">
          <div className="mt-6 flex items-center justify-between rounded-xl border px-4 py-2">
            <input className="w-36 sm:w-80" value={linkValue} readOnly={true} />
            <button
              onClick={async (event) => {
                event.preventDefault();
                await copyLink(linkValue);
              }}
              className="bg-primary rounded-full px-3 py-1.5 text-white"
            >
              コピー
            </button>
          </div>
          <div className="mt-5 flex items-center gap-x-3">
            <label
              htmlFor="videoTimeCheckbox"
              className="flex cursor-pointer items-center gap-x-3 text-gray-500"
            >
              <input
                id="videoTimeCheckbox"
                type="checkbox"
                onChange={handleTime}
                checked={isTime}
                className="text-primary h-5 w-5 rounded border-gray-300 bg-gray-100"
              />
              動画の開始位置を設定
            </label>
            <input
              autoComplete="off"
              size={6}
              value={inputValue}
              className={`${
                !isTime ? "border-transparent text-gray-300" : "border-gray-600"
              } appearance-none border-b bg-transparent outline-none focus:ring-0 focus-visible:ring-0`}
              disabled={!isTime}
              onChange={handleChange}
              onBlur={handleBlur}
            />
          </div>
        </div>
      </Dialog.Panel>
    </Modal>
  );
}
