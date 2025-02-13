import React from "react";
import { useNavigate } from "react-router-dom";
import EmptyImg from "./../assets/empty-img.png";
import useStore from "../store/useStore";
function ErrorPage() {
  const navigate = useNavigate();
  const { isDarkMode } = useStore();
  return (
    <div className="min-h-screen ">
      <div className="flex flex-col items-center justify-center text-center sm:mt-0 sm:p-40 mt-[102px]">
        <img
          className="mb-[40px] md:mb-[64px] max-w-[241px] w-[100%] max-h-[200px] h-[100%] "
          src={EmptyImg}
          alt="empty logo"
        />
        <h1
          className={`text-[20px]  mb-[24px] font-bold animate-slide-down ${
            isDarkMode ? "text-white" : "text-black"
          }`}
        >
          There is nothing here
        </h1>
        <button
          onClick={() => {
            navigate("/");
          }}
          className={` sm:text-xl text-base hover:underline underline-offset-8 cursor-pointer  animate-slide-down ${
            isDarkMode ? "text-white" : "text-black"
          }`}
        >
          Click for return to Home page <br />
        </button>
      </div>
    </div>
  );
}

export default ErrorPage;
