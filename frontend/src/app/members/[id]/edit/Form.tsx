"use client";

import { useState } from "react";
import { registerAction } from "./_action";
import TextareaAutosize from "react-textarea-autosize";
import { useForm } from "react-hook-form";
import { useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { MemberSchema, FormSchema } from "@src/app/members/[id]/edit/schema";
import { useRequireLogin } from "@src/hooks/useRequireLogin";

type InputFieldProps = {
  id: string;
  register: any;
  placeholder: string;
  errors: any;
};

const InputField: React.FC<InputFieldProps> = ({
  id,
  register,
  placeholder,
  errors,
}) => (
  <>
    <input
      className="w-full block resize-none rounded-md border-2 border-gray-100 bg-gray-50 px-4 py-2 mb-3"
      type="text"
      id={id}
      placeholder={placeholder}
      {...register(id)}
    />
    {errors[id] && (
      <span className="text-sm text-red-500 mb-3 block">
        {errors[id]?.message}
      </span>
    )}
  </>
);

type SelectFieldProps = {
  id: string;
  register: any;
  errors: any;
  options: { label: string; value: string }[];
};

const SelectField: React.FC<SelectFieldProps> = ({
  id,
  register,
  errors,
  options,
}) => (
  <>
    <select
      className="w-full appearance-none block resize-none rounded-md border-2 border-gray-100 bg-gray-50 px-4 py-2 mb-3"
      id={id}
      {...register(id)}
    >
      {options.map((option, i) => (
        <option key={i} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
    {errors[id] && (
      <span className="text-sm text-red-500 mb-3 block">
        {errors[id]?.message}
      </span>
    )}
  </>
);

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
  useRequireLogin();

  const [done, setDone] = useState<boolean>(false);
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormSchema>({
    resolver: zodResolver(MemberSchema),
    defaultValues: member,
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
    <section className="my-8">
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
            <label className="mb-2 flex font-bold items-center">
              議員名<span className="text-red-500 font-normal ml-2">必須</span>
            </label>
            <InputField
              id="name"
              register={register}
              placeholder="議員名を入力"
              errors={errors}
            />
            <label className="mb-2 flex font-bold items-center">
              フルネーム
            </label>
            <div className="flex gap-x-4">
              <InputField
                id="firstName"
                register={register}
                placeholder="山田"
                errors={errors}
              />
              <InputField
                id="lastName"
                register={register}
                placeholder="太郎"
                errors={errors}
              />
            </div>
            <label className="mb-2 flex font-bold items-center">ひらがな</label>
            <div className="flex gap-x-4">
              <InputField
                id="firstNameHira"
                register={register}
                placeholder="やまだ"
                errors={errors}
              />
              <InputField
                id="lastNameHira"
                register={register}
                placeholder="たろう"
                errors={errors}
              />
            </div>
            <label className="mb-2 flex font-bold items-center">
              公式サイト
            </label>
            <InputField
              id="website"
              register={register}
              placeholder="https://example.com"
              errors={errors}
            />
            <label className="mb-2 flex font-bold items-center">Twitter</label>
            <InputField
              id="twitter"
              register={register}
              placeholder="@を含めないで入力"
              errors={errors}
            />
            <label className="mb-2 flex font-bold items-center">
              所属政党
              <span className="text-red-500 font-normal ml-2">必須</span>
            </label>
            <SelectField
              id="groupId"
              register={register}
              errors={errors}
              options={[
                { label: "無所属・その他", value: "" },
                ...groups.map((group) => ({
                  label: group.name,
                  value: group.id,
                })),
              ]}
            />
            <label className="mb-2 flex font-bold items-center">
              議会<span className="text-red-500 font-normal ml-2">必須</span>
            </label>
            <SelectField
              id="house"
              register={register}
              errors={errors}
              options={[
                { label: "参議院", value: "COUNCILLORS" },
                { label: "衆議院", value: "REPRESENTATIVES" },
              ]}
            />
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
    </section>
  );
}
