import useStore from "../store/useStore";
import Avatar from "./../assets/Oval.svg";
import { MdLightMode } from "react-icons/md";
import { IoMoonSharp } from "react-icons/io5";
export default function Sidebar() {
  const { isDarkMode, toggleDarkMode } = useStore();

  return (
    <div
      className={`
        sm:fixed sticky  top-0 left-0 sm:max-w-16 w-full h-16 sm:h-screen
        flex sm:flex-col max-w-full  items-center justify-between
        ${isDarkMode ? "bg-[#1e2139]" : "bg-[#373b53]"}
      `}
    >
      <div className="h-16 w-16 z-[9999] bg-[#7c5dfa] flex items-center justify-center rounded-br-3xl">
        <svg width="40" height="36">
          <path
            d="M20.513 0C24.965 2.309 28 6.91 28 12.21 28 19.826 21.732 26 14 26S0 19.826 0 12.21C0 6.91 3.035 2.309 7.487 0L14 12.9z"
            fill="#fff"
          />
        </svg>
      </div>
      <div className="flex sm:flex-col items-center gap-4 sm:pb-4">
        <button onClick={toggleDarkMode} className="mb-2 sm:mb-8 text-2xl">
          {isDarkMode ? (
            <MdLightMode className="text-[#7e88c3] " />
          ) : (
            <IoMoonSharp className="text-[#7e88c3]" />
          )}
        </button>
        <hr className="bg-white text-white w-full" />

        <img src={Avatar} width={40} height={40} alt="user img" />
      </div>
    </div>
  );
}
