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
    <div className="grid grid-cols-1 gap-3 md:grid-cols-4 md:gap-8">
      {topics.map((view) => (
        <Link
          className="flex items-center rounded-md border bg-white px-6 py-4"
          href={`/topics/${view.name}`}
          key={view.name}
        >
          <div className="mr-4 rounded-full bg-[#e0efff] p-5">
            <FaHashtag className="text-3xl text-[#3ea8ff]" />
          </div>
          <span className="text-lg font-bold">{view.name}</span>
        </Link>
      ))}
    </div>
  );
};

export default TopicsGrid;
