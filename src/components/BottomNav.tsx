import React from "react";
import {
  FaCog,
  FaCogs,
  FaComment,
  FaStore,
  FaTrophy,
  FaUserFriends,
} from "react-icons/fa";
import aroan from "../assets/aroan.jpeg";
import { Link } from "react-router-dom";

function BottomNav({
  links,
  menuOpen,
  setMenuOpen,
}: {
  links?: string[];
  menuOpen: boolean;
  setMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  return (
    <div>
      <div className="fixed bottom-4 left-1/2 z-50 h-16 w-full max-w-md -translate-x-1/2 rounded-full border border-gray-200 bg-white ">
        <div className="mx-auto grid h-full max-w-lg grid-cols-5">
          {/* CHARACTER BUTTON */}
          <Link
            to="/character"
            type="button"
            className="group inline-flex flex-col items-center justify-center rounded-l-full px-5 hover:bg-gray-50 "
          >
            <img className="h-10 w-10 rounded-full" src={aroan} alt="" />
            <span className="sr-only">Home</span>
          </Link>
          <div
            id="tooltip-home"
            role="tooltip"
            className="tooltip invisible absolute z-10 inline-block rounded-lg bg-gray-900 px-3 py-2 text-sm font-medium text-white opacity-0 shadow-sm transition-opacity duration-300 dark:bg-gray-700"
          >
            Home
            <div className="tooltip-arrow" data-popper-arrow></div>
          </div>

          {/* ONLINE FRIENDS BUTTON */}
          <Link
            to={"/friends"}
            type="button"
            className="group inline-flex flex-col items-center justify-center px-5 text-2xl hover:bg-gray-50 "
          >
            <FaUserFriends />
          </Link>
          <div
            id="tooltip-wallet"
            role="tooltip"
            className="tooltip invisible absolute z-10 inline-block rounded-lg bg-gray-900 px-3 py-2 text-sm font-medium text-white opacity-0 shadow-sm transition-opacity duration-300 dark:bg-gray-700"
          >
            Wallet
            <div className="tooltip-arrow" data-popper-arrow></div>
          </div>

          {/* CENTER BUTTON */}
          <div className="flex items-center justify-center">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              data-tooltip-target="tooltip-new"
              type="button"
              className="group inline-flex h-10 w-72 items-center justify-center rounded-full bg-blue-600 font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-800"
            >
              <p>Play</p>
              <span className="sr-only">New item</span>
            </button>
          </div>
          <div
            id="tooltip-new"
            role="tooltip"
            className="tooltip invisible absolute z-10 inline-block rounded-lg bg-gray-900 px-3 py-2 text-sm font-medium text-white opacity-0 shadow-sm transition-opacity duration-300 dark:bg-gray-700"
          >
            Create new item
            <div className="tooltip-arrow" data-popper-arrow></div>
          </div>

          {/* TOURNAMENT BUTTON */}
          <button
            data-tooltip-target="tooltip-profile"
            type="button"
            className="group inline-flex flex-col items-center justify-center rounded-r-full px-5 text-2xl hover:bg-gray-50 "
          >
            <FaTrophy />
            <span className="sr-only">Profile</span>
          </button>
          <div
            id="tooltip-profile"
            role="tooltip"
            className="tooltip invisible absolute z-10 inline-block rounded-lg bg-gray-900 px-3 py-2 text-sm font-medium text-white opacity-0 shadow-sm transition-opacity duration-300 dark:bg-gray-700"
          >
            Profile
            <div className="tooltip-arrow" data-popper-arrow></div>
          </div>

          {/* SETTINGS BUTTON */}
          <button
            data-tooltip-target="tooltip-settings"
            type="button"
            className="group inline-flex flex-col items-center justify-center px-5 text-2xl hover:bg-gray-50 "
          >
            <FaStore />
            <span className="sr-only">Settings</span>
          </button>
          <div
            id="tooltip-settings"
            role="tooltip"
            className="tooltip invisible absolute z-10 inline-block rounded-lg bg-gray-900 px-3 py-2 text-sm font-medium text-white opacity-0 shadow-sm transition-opacity duration-300 dark:bg-gray-700"
          >
            Settings
            <div className="tooltip-arrow" data-popper-arrow></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BottomNav;
