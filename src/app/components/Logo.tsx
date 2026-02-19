"use client";

export default function Logo({
  size = "md",
  light = false,
}: {
  size?: "sm" | "md" | "lg";
  light?: boolean;
}) {
  const sizes = {
    sm: "text-lg",
    md: "text-2xl",
    lg: "text-4xl",
  };

  return (
    <span
      className={`font-bold tracking-tight ${sizes[size]} ${
        light ? "text-white" : "text-primary"
      }`}
    >
      <span className="inline-flex items-center gap-1.5">
        <svg
          viewBox="0 0 28 28"
          fill="none"
          className={
            size === "sm" ? "w-5 h-5" : size === "md" ? "w-7 h-7" : "w-9 h-9"
          }
        >
          <circle
            cx="14"
            cy="14"
            r="13"
            stroke={light ? "#fff" : "#4f46e5"}
            strokeWidth="2"
          />
          <path
            d="M8 18 L14 8 L20 18"
            stroke={light ? "#fff" : "#4f46e5"}
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
          <circle
            cx="14"
            cy="18"
            r="2"
            fill={light ? "#67e8f9" : "#06b6d4"}
          />
        </svg>
        riseva
      </span>
    </span>
  );
}
