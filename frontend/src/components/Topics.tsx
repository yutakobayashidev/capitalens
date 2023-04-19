import Link from "next/link";
import { FaHashtag } from "react-icons/fa";

interface Topic {
  name: string;
}

interface Props {
  topics: Topic[];
}

const TopicsGrid: React.FC<Props> = ({ topics }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-3 md:gap-8">
      {topics.map((view) => (
        <Link
          className="px-6 py-4 flex items-center border bg-white rounded-md"
          href={`/topics/${view.name}`}
          key={view.name}
        >
          <div className="p-5 rounded-full bg-[#e0efff] mr-4">
            <FaHashtag className="text-3xl text-[#3ea8ff]" />
          </div>
          <span className="font-bold text-lg">{view.name}</span>
        </Link>
      ))}
    </div>
  );
};

export default TopicsGrid;
