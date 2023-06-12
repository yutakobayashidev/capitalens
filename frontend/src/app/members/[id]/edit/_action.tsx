"use server";

import { MemberSchema } from "@src/app/members/[id]/edit/schema";
import { zact } from "zact/server";
import prisma from "@src/lib/prisma";
import { hiraToKana } from "@src/helper/utils";

export const registerAction = zact(MemberSchema)(async (data) => {
  const {
    name,
    id,
    groupId,
    house,
    firstName,
    lastName,
    firstNameHira,
    twitter,
    lastNameHira,
    description,
    website,
  } = data;

  const fullname = firstName && lastName ? firstName + lastName : null;
  const nameHira =
    firstNameHira && lastNameHira ? firstNameHira + lastNameHira : null;
  const nameKana = hiraToKana(nameHira);
  const firstNameKana = hiraToKana(firstNameHira);
  const lastNameKana = hiraToKana(lastNameHira);

  const currentMember = await prisma.member.findUnique({
    where: {
      id: id,
    },
    select: {
      group: true,
    },
  });

  let groupData;

  if (groupId) {
    groupData = { connect: { id: groupId } };
  } else if (currentMember && currentMember.group) {
    groupData = { disconnect: true };
  }

  const res = await prisma.member.update({
    where: {
      id: id,
    },
    data: {
      name,
      twitter,
      description,
      fullname,
      firstName,
      lastName,
      nameHira,
      firstNameHira,
      lastNameHira,
      nameKana,
      firstNameKana,
      lastNameKana,
      house,
      group: groupData,
      website,
    },
  });

  if (res) {
    const embed = {
      title: `${name} (ID: ${id})`,
      description,
      url: website,
      fields: [
        { name: "Name", value: name, inline: true },
        { name: "House", value: house, inline: true },
        { name: "Group ID", value: groupId ?? "無所属・その他", inline: true },
      ],
    };

    const discordData = {
      content: "Member information has been updated!",
      embeds: [embed],
    };

    const WEBHOOK_URL = process.env.WEBHOOK_URL as string;

    await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(discordData),
    });
  }

  return res;
});
