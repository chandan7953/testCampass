import { Loader2 } from "lucide-react";


const Button = ({
  children,
  type = "button",
  loading = false,
  disabled = false,
}) => {

  return (

    <button
      type={type}
      disabled={disabled || loading}
      className="
        flex
        w-full
        items-center
        justify-center
        gap-2
        rounded-xl
        bg-blue-600
        py-3
        font-semibold
        text-white
        transition
        hover:bg-blue-700
        disabled:cursor-not-allowed
        disabled:opacity-70
      "
    >

      {
        loading ? (
          <>
            <Loader2
              size={20}
              className="animate-spin"
            />

            Loading...

          </>
        )
        :
        children
      }

    </button>

  );
};


export default Button;