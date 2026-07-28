const InfoCard = ({
  icon: Icon,
  title,
  value,
  iconColor = "text-blue-400",
}) => {

  return (
    <div
      className="
        rounded-2xl
        border
        border-white/10
        bg-white/5
        p-5
        backdrop-blur-xl
      "
    >

      <div className="flex items-center gap-4">

        <div
          className="
            flex
            h-11
            w-11
            items-center
            justify-center
            rounded-xl
            bg-white/5
          "
        >
          <Icon
            size={22}
            className={iconColor}
          />
        </div>


        <div>

          <p className="text-sm text-gray-500">
            {title}
          </p>

          <p className="mt-1 text-sm font-medium text-white break-all">
            {value}
          </p>

        </div>

      </div>

    </div>
  );
};


export default InfoCard;