"use client";

import { useState } from "react";
import { registerAction } from "./_action";
import TextareaAutosize from "react-textarea-autosize";
import { useForm } from "react-hook-form";
import { useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { MemberSchema, FormSchema } from "@src/app/members/[id]/edit/schema";

export default function Form({
  member,
  groups,
}: {
  member: FormSchema;
  groups: {
    name: string;
    id: string;
  }[];
}) {
  const [done, setDone] = useState<boolean>(false);
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormSchema>({
    resolver: zodResolver(MemberSchema),
    defaultValues: {
      id: member.id,
      name: member.name,
      firstName: member.firstName,
      lastName: member.lastName,
      firstNameHira: member.firstNameHira,
      lastNameHira: member.lastNameHira,
      description: member.description,
      website: member.website,
      twitter: member.twitter,
      house: member.house,
      groupId: member.groupId,
    },
  });

  const onSubmit = handleSubmit((data) => {

    startTransition(async () => {
      const response = await registerAction(data);

      if (response) {
        setDone(true);
      }
    });
  });

  return (
    <>
      {done ? (
        <div className="text-center">
          <h1 className="text-4xl mb-5 font-bold">
            開発チームに送信されました
          </h1>
          <p className="text-gray-600 text-lg">
            ご協力ありがとうございます。開発チームが確認の上公開されます。
          </p>
          <img src="/undraw_Chasing_love_re_9r1c.png" alt="Chasing love" />
        </div>
      ) : (
        <div>
          <h1 className="text-4xl font-bold text-center mb-5">
            {member.name}議員の情報を更新する
          </h1>
          <form onSubmit={onSubmit}>
            <label className="mb-2 flex font-bold items-center">議員名</label>
            <input
              className="w-full block resize-none rounded-md border-2 border-gray-100 bg-gray-50 px-4 py-2 mb-3"
              type="text"
              id="name"
              placeholder="議員名を入力"
              {...register("name")}
            />
            {errors.name && <span>{errors.name?.message}</span>}
            <label className="mb-2 flex font-bold items-center">
              フルネーム
            </label>
            <div className="flex gap-x-4">
              <input
                className="w-full block resize-none rounded-md border-2 border-gray-100 bg-gray-50 px-4 py-2 mb-3"
                type="text"
                placeholder="山田"
                id="firstName"
                {...register("firstName")}
              />
              <input
                className="w-full block resize-none rounded-md border-2 border-gray-100 bg-gray-50 px-4 py-2 mb-3"
                type="text"
                placeholder="太郎"
                id="lastName"
                {...register("lastName")}
              />
            </div>
            <label className="mb-2 flex font-bold items-center">ひらがな</label>
            <div className="flex gap-x-4">
              <input
                className="w-full block resize-none rounded-md border-2 border-gray-100 bg-gray-50 px-4 py-2 mb-3"
                type="text"
                placeholder="やまだ"
                id="firstNameHira"
                {...register("firstNameHira")}
              />
              <input
                className="w-full block resize-none rounded-md border-2 border-gray-100 bg-gray-50 px-4 py-2 mb-3"
                type="text"
                placeholder="たろう"
                id="lastNameHira"
                {...register("lastNameHira")}
              />
            </div>
            <label className="mb-2 flex font-bold items-center">
              公式サイト
            </label>
            <input
              className="w-full block resize-none rounded-md border-2 border-gray-100 bg-gray-50 px-4 py-2 mb-3"
              type="text"
              id="website"
              placeholder="https://example.com"
              {...register("website")}
            />
            {errors.website && <span>{errors.website?.message}</span>}
            <label className="mb-2 flex font-bold items-center">Twitter</label>
            <input
              className="w-full block resize-none rounded-md border-2 border-gray-100 bg-gray-50 px-4 py-2 mb-3"
              type="text"
              id="twitter"
              placeholder="@を含めないで入力"
              {...register("twitter")}
            />
            {errors.twitter && <span>{errors.twitter?.message}</span>}
            <label className="mb-2 flex font-bold items-center">所属政党</label>
            <select
              className="w-full block resize-none rounded-md border-2 border-gray-100 bg-gray-50 px-4 py-2 mb-3"
              id="group"
              {...register("groupId")}
            >
              <option value="">無所属・その他</option>
              {groups.map((annotation, i) => (
                <option key={i} value={annotation.id}>
                  {annotation.name}
                </option>
              ))}
            </select>
            {errors.groupId && <span>{errors.groupId?.message}</span>}
            <label className="mb-2 flex font-bold items-center">議会</label>
            <select
              className="w-full block resize-none rounded-md border-2 border-gray-100 bg-gray-50 px-4 py-2 mb-3"
              id="house"
              {...register("house")}
            >
              <option value="COUNCILLORS">参議院</option>
              <option value="REPRESENTATIVES">衆議院</option>
            </select>
            {errors.house && <span>{errors.house.message}</span>}
            <label className="mb-2 flex font-bold items-center">説明</label>
            <TextareaAutosize
              {...register("description")}
              className="w-full block resize-none rounded-md border-2 border-gray-100 bg-gray-50 px-4 py-2 mb-3"
              id="description"
            />
            <div className="flex justify-center">
              <button
                className="text-center mt-3 text-white shadow bg-blue-500 transition-all duration-500 ease-in-out hover:shadow-md text-xl font-bold px-6 py-2 rounded-full"
                disabled={isPending}
              >
                送信する
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
