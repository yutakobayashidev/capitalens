import { peoples } from '@peoples';

export function getPeopleById(id: string) {
  return peoples.find((people) => people.id === id);
}

export function getPeopleByName(name: string) {
  return peoples.find((people) => people.name === name);
}
