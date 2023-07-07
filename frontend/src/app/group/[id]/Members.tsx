"use client";

import Link from "next/link";
import { useEffect,useState } from "react";

export default function Members({
  members,
}: {
  members: {
    id: string;
    name: string;
    image: string | null;
  }[];
}) {
  const [search, setSearch] = useState("");
  const [filteredMembers, setFilteredMembers] = useState(members);

  useEffect(() => {
    setFilteredMembers(
      members.filter((member) =>
        member.name.toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [search, members]);

  return (
    <>
      <input
        placeholder="フルネーム、ひらがな、カタカナで検索"
        value={search}
        className="mb-3 block w-full resize-none rounded-md border-2 border-gray-100 bg-gray-50 px-4 py-2"
        onChange={(e) => setSearch(e.target.value)}
      />
      <div className="grid grid-cols-4 gap-4 md:grid-cols-12">
        {filteredMembers.map((member) => (
          <Link href={`/members/${member.id}`} key={member.id}>
            <img
              src={member.image ?? "/noimage.png"}
              className="mr-3 h-20 w-20 rounded-full border object-cover object-center"
              alt={member.name}
            />
          </Link>
        ))}
      </div>
    </>
  );
}
