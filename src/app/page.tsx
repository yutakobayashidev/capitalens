import { People } from "@src/types/people";
import { peoples } from "@peoples";
import Link from "next/link";

type GroupedPeoples = {
  [key: string]: People[];
};

const groupPeoples = (peoples: People[]): GroupedPeoples => {
  return peoples.reduce((groups: GroupedPeoples, person: People) => {
    const party = person.party || "無所属";
    if (!groups[party]) {
      groups[party] = [];
    }
    groups[party].push(person);
    return groups;
  }, {});
};

export default async function Page() {
  const groupedPeoples = groupPeoples(peoples);

  return (
    <div className="mx-auto max-w-screen-xl px-4 md:px-8">
      {Object.entries(groupedPeoples).map(([party, members]) => (
        <section key={party} className="my-8">
          <h2 className="font-bold text-2xl">{party}</h2>
          <div className="grid grid-cols-3 gap-3 md:grid-cols-6 md:gap-6 my-5">
            {members.map((member) => (
              <Link
                className="flex items-center justify-content flex-wrap text-center "
                href={`people/${member.id}`}
                key={member.id}
              >
                <img
                  src={member.image}
                  className="rounded-2xl"
                  alt={member.name}
                />
                <div className="w-full overflow-hidden text-ellipsis whitespace-nowrap">
                  <div className="my-3 font-bold text-xl">{member.name}</div>
                  <span className="text-sm text-gray-500">{member.role}</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
