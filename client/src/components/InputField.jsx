const InputField = ({
  label,
  name,
  type = "text",
  placeholder,
  value,
  onChange,
  onKeyDown,
  icon: Icon,
  error,
}) => {

  return (
    <div className="w-full">

      <label className="mb-2 block text-sm font-medium text-gray-300">
        {label}
      </label>


      <div className="relative">

        {Icon && (
          <Icon
            size={18}
            className="
              absolute
              left-4
              top-3.5
              text-gray-500
            "
          />
        )}


        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          onKeyDown={onKeyDown}
          placeholder={placeholder}
          className={`
            w-full
            rounded-xl
            border
            ${
              error
              ? "border-red-500"
              : "border-gray-700"
            }
            bg-[#18181f]
            py-3
            text-white
            outline-none
            transition
            placeholder:text-gray-500
            focus:border-blue-500
            ${
              Icon
              ? "pl-11"
              : "px-4"
            }
          `}
        />

      </div>


      {error && (
        <p className="mt-1 text-sm text-red-500">
          {error}
        </p>
      )}

    </div>
  );
};


export default InputField;