const Logo = () => {
  return (
    <div className="flex items-center gap-3 cursor-pointer">

      <svg
        width="38"
        height="38"
        viewBox="0 0 64 64"
      >
        <rect
          width="64"
          height="64"
          rx="16"
          fill="#3b82f6"
        />

        <rect
          x="8"
          y="12"
          width="48"
          height="40"
          rx="8"
          fill="none"
          stroke="#fff"
          strokeWidth="3"
        />

        <rect
          x="16"
          y="18"
          width="32"
          height="10"
          rx="3"
          fill="#fff"
          opacity="0.4"
        />

        <rect
          x="16"
          y="36"
          width="20"
          height="7"
          rx="2"
          fill="#fff"
          opacity="0.4"
        />

      </svg>


      <span className="text-xl font-bold tracking-wide text-white">
        CampusPass
      </span>

    </div>
  );
};

export default Logo;