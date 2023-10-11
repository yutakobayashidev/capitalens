import TextareaAutosize from "react-textarea-autosize";

type SelectFieldProps = {
  id: string;
  errors: any;
  options: { label: string; value: string }[];
  register: any;
};

type InputFieldProps = {
  id: string;
  errors: any;
  placeholder: string;
  register: any;
};

export const SelectField: React.FC<SelectFieldProps> = ({
  id,
  errors,
  options,
  register,
}) => (
  <>
    <select
      className="mb-3 block w-full resize-none appearance-none rounded-md border-2 border-gray-100 bg-gray-50 px-4 py-2"
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
      <span className="mb-3 block text-sm text-red-500">
        {errors[id]?.message}
      </span>
    )}
  </>
);

export const TextareaField: React.FC<InputFieldProps> = ({
  id,
  errors,
  placeholder,
  register,
}) => (
  <>
    <TextareaAutosize
      {...register(id)}
      minRows={2}
      placeholder={placeholder}
      className="mb-3 block w-full resize-none rounded-md border-2 border-gray-100 bg-gray-50 px-4 py-2"
      id={id}
    />
    {errors[id] && (
      <span className="mb-3 block text-sm text-red-500">
        {errors[id]?.message}
      </span>
    )}
  </>
);

export const InputField: React.FC<InputFieldProps> = ({
  id,
  errors,
  placeholder,
  register,
}) => (
  <>
    <input
      className="mb-3 block w-full resize-none rounded-md border-2 border-gray-100 bg-gray-50 px-4 py-2"
      type="text"
      id={id}
      placeholder={placeholder}
      {...register(id)}
    />
    {errors[id] && (
      <span className="mb-3 block text-sm text-red-500">
        {errors[id]?.message}
      </span>
    )}
  </>
);
