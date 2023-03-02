import { peoples } from "@peoples";

export function getPeopleById(id: string) {
  return peoples.find((people) => people.id === id);
}
