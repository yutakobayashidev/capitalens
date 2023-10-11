import { FaUser } from "react-icons/fa";

type Note = {
  end: number;
  start: number;
  text: string;
};

export default function Notes({ note }: { note: Note }) {
  return (
    <div className="bg-gray-100">
      <div className="overflow-hidden rounded-xl">
        <div className="flex items-center bg-primary px-4 py-2 text-sm font-bold text-white md:text-base">
          <FaUser className="mr-1 text-lg" />
          この会議の視聴者が背景情報を追加しました
        </div>
        <div className="p-4">
          <p className="mb-3">{note.text}</p>
          <p className="mt-5 text-xs text-slate-500">
            この背景情報はアカウントの作成期間が一定期間達している会議の視聴者によって作成されました
          </p>
        </div>
      </div>
    </div>
  );
}
