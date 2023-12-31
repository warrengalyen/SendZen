import { PaperAirplaneIcon } from "@heroicons/react/24/solid";
import Link from "next/link";

export default function Logo({
  type,
  justifyContent,
  colorTheme,
  size,
}: {
  justifyContent: string;
  type?: "iconAndText";
  colorTheme?: "light" | "dark";
  size?: "lg";
}) {
  return (
    <Link href="/">
      <div className={`${justifyContent} align-center flex`}>
        {type === "iconAndText" && (
          <h3
            className={`${
              colorTheme === "light" ? "text-white" : "text-gray-900"
            } tracking-loose mb-0 pb-0 font-bold ${
              size === "lg" ? "text-3xl" : "text-2xl"
            }`}
          >
            SendZen
          </h3>
        )}

        <svg
          xmlns="http://www.w3.org/2000/svg"
          width={size === "lg" ? 40 : 30}
          viewBox="0 0 512.001 512.001"
        >
          <path
            d="m102.537 236.375 48.035 234.775L503.831 40.851z"
            fill="#027372"
          />
          <path
            d="M251.97 369.49 150.572 471.15l17.267-147.838 64.707 1.77z"
            fill="#02acab"
          />
          <path
            d="M503.831 40.851 114.133 293.049 8.17 233.352zM503.831 40.851l-.512 1.427L298.835 395.21l-130.996-71.898z"
            fill="#81e3e2"
          />
          <path
            d="M298.835 395.21 503.319 42.278 363.968 430.963z"
            fill="#42c8c6"
          />
          <path d="M509.532 34.999a8.166 8.166 0 0 0-8.658-1.764L5.213 225.734a8.17 8.17 0 0 0-1.054 14.734l102.719 57.875 35.651 174.259a8.162 8.162 0 0 0 1.633 3.615c1.256 1.571 3.037 2.668 5.113 3a7.984 7.984 0 0 0 1.306.104 8.128 8.128 0 0 0 5.502-2.143c.117-.108.219-.205.318-.306l77.323-77.52a8.171 8.171 0 0 0-11.57-11.54l-60.739 60.894 13.124-112.394 185.495 101.814a8.157 8.157 0 0 0 6.435.614 8.15 8.15 0 0 0 4.72-3.961c.212-.404.382-.8.517-1.202L511.521 43.608a8.17 8.17 0 0 0-1.989-8.609zm-482.3 199.713L432.364 77.371l-318.521 206.14-86.611-48.799zm135.488 82.224a8.173 8.173 0 0 0-2.143 2.621 8.143 8.143 0 0 0-.879 2.986L148.365 419.6l-25.107-122.718L398.363 118.84 162.72 316.936zm196.787 102.258-177.284-97.307L485.928 66.574l-126.421 352.62z" />
        </svg>
      </div>
    </Link>
  );
}
