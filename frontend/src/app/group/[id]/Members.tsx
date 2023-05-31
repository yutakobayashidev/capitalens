"use client";

import { Member } from "@src/types/member";
import Link from "next/link";
import { useState, useEffect } from "react";

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
        className="w-full block resize-none rounded-md border-2 border-gray-100 bg-gray-50 px-4 py-2 mb-3"
        onChange={(e) => setSearch(e.target.value)}
      />
      <div className="grid md:grid-cols-12 grid-cols-4 gap-4">
        {filteredMembers.map((member) => (
          <Link href={`/members/${member.id}`} key={member.id}>
            <img
              src={member.image ?? "/noimage.png"}
              className="border rounded-full w-20 h-20 mr-3 object-cover object-center"
              alt={member.name}
            />
          </Link>
        ))}
      </div>
    </>
  );
}
