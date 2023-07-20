"use server";

import { auth } from "@auth";
import { config } from "@site.config";
import { MemberSchema } from "@src/app/members/[id]/edit/schema";
import { hiraToKana } from "@src/helper/utils";
import prisma from "@src/lib/prisma";
import { zact } from "zact/server";

export const updateMember = zact(MemberSchema)(async (data) => {
  const session = await auth();

  if (!session) {
    return {
      error: "Unauthorized",
    };
  }

  const now = new Date();
  const twoWeeksInMilliseconds = 2 * 7 * 24 * 60 * 60 * 1000;

  if (
    now.getTime() - new Date(session.user.createdAt).getTime() <
    twoWeeksInMilliseconds
  ) {
    return {
      error: "Unauthorized",
    };
  }

  const {
    id,
    name,
    description,
    firstName,
    firstNameHira,
    groupId,
    house,
    lastName,
    lastNameHira,
    twitter,
    website,
  } = data;

  const fullname = firstName && lastName ? firstName + lastName : null;
  const nameHira =
    firstNameHira && lastNameHira ? firstNameHira + lastNameHira : null;
  const nameKana = hiraToKana(nameHira);
  const firstNameKana = hiraToKana(firstNameHira);
  const lastNameKana = hiraToKana(lastNameHira);

  const currentMember = await prisma.member.findUnique({
    select: {
      group: true,
    },
    where: {
      id: id,
    },
  });

  let groupData;

  if (groupId) {
    groupData = { connect: { id: groupId } };
  } else if (currentMember && currentMember.group) {
    groupData = { disconnect: true };
  }

  const res = await prisma.member.update({
    data: {
      name,
      description,
      firstName,
      firstNameHira,
      firstNameKana,
      fullname,
      group: groupData,
      house,
      lastName,
      lastNameHira,
      lastNameKana,
      nameHira,
      nameKana,
      twitter,
      website,
    },
    where: {
      id: id,
    },
  });

  if (res) {
    const embed = {
      title: `${name} (ID: ${id})`,
      color: 1986741,
      description,
      fields: [
        { name: "Name", inline: true, value: name },
        { name: "House", inline: true, value: house },
        { name: "Group ID", inline: true, value: groupId ?? "無所属・その他" },
      ],
      url: config.siteRoot + "members/" + id,
    };

    const discordData = {
      content: "Member information has been updated!",
      embeds: [embed],
    };

    const WEBHOOK_URL = process.env.WEBHOOK_URL as string;

    await fetch(WEBHOOK_URL, {
      body: JSON.stringify(discordData),
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
    });
  }

  return res;
});
