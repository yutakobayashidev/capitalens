"use server";

import { MemberSchema } from "@src/app/members/[id]/edit/schema";
import { zact } from "zact/server";
import prisma from "@src/lib/prisma";
import { hiraToKana } from "@src/helper/utils";

export const registerAction = zact(MemberSchema)(async (data) => {
  const fullname = data.firstName && data.lastName ? data.firstName + data.lastName : null
  const nameHira =  data.firstNameHira && data.lastNameHira ? data.firstNameHira + data.lastNameHira : null
  const nameKana = hiraToKana(nameHira);
  const firstNameKana = hiraToKana(data.firstNameHira);
  const lastNameKana = hiraToKana(data.lastNameHira);

  // Get the current group of the member
  const currentMember = await prisma.member.findUnique({
    where: {
      id: data.id,
    },
    select: {
      group: true,
    },
  });

  let groupData;

  if (data.groupId) {
    groupData = { connect: { id: data.groupId } };
  } else if (currentMember && currentMember.group) {
    groupData = { disconnect: true };
  }

  const res = await prisma.member.update({
    where: {
      id: data.id,
    },
    data: {
      name: data.name,
      twitter: data.twitter,
      description: data.description,
      fullname: fullname,
      firstName: data.firstName,
      lastName: data.lastName,
      nameHira,
      firstNameHira: data.firstNameHira,
      lastNameHira: data.lastNameHira,
      nameKana,
      firstNameKana,
      lastNameKana,
      house: data.house,
      group: groupData,
      website: data.website,
    },
  });

  return res;
});
