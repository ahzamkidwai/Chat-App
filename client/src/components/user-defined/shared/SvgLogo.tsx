const SvgLogo = () => {
  return (
    <div
      className="p-3 rounded-full"
      style={{ backgroundColor: "#007bff" }} // Blue background
    >
      <svg
        width="48"
        height="48"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ color: "#ffffff" }}
      >
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        <circle cx="9" cy="10" r="1" />
        <circle cx="13" cy="10" r="1" />
        <circle cx="17" cy="10" r="1" />
      </svg>
    </div>
  );
};

export default SvgLogo;
