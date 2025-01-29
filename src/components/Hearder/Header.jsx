import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, MenuButton, MenuItems, MenuItem } from "@headlessui/react";
import { RxActivityLog } from "react-icons/rx";
import { FaUser } from "react-icons/fa";
import { LuMessageSquareText } from "react-icons/lu";
import { HiOutlineDocumentCurrencyDollar } from "react-icons/hi2";
import { CiViewList } from "react-icons/ci";
import { RiLockPasswordFill } from "react-icons/ri";
import { CiLogout } from "react-icons/ci";

const Header = () => {
  const navigate = useNavigate();
  const [userDetails, setUserDetails] = useState({
    username: "",
    userType: "",
  });

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user"));
    if (userData?.data?.user) {
      setUserDetails({
        username: userData.data.user.username,
        userType: userData.data.user.user_type.name,
      });
    }
  }, []);
  const handleProfile = () => {
    navigate("/profile");
  };

  return (
    <nav className="top-0 left-0 w-full z-50 flex justify-between items-center bg-white shadow-md px-6 py-3">
      {/* Logo Section */}
      <div className="w-20">
        <img
          src="/src/assets/Images/Images-nav/logo-image.jpg"
          alt="Company Logo"
          className="h-12 w-full  ml-24"
        />
      </div>

      {/* User Info & Menu */}
      <div className="flex items-center space-x-3">
        <p className="text-gray-600 text-sm underline">
          {userDetails.userType}
        </p>

        <Menu as="div" className="relative inline-block text-left">
          <MenuButton className="flex items-center gap-2 rounded-full bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            <span>{userDetails.username}</span>
            <img
              src="/src/assets/Images/Images-nav/images.png"
              className="h-8 w-8 rounded-full"
              alt="Profile"
            />
          </MenuButton>

          <MenuItems className="absolute right-0 z-10 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none">
            <div className="py-1">
              <MenuItem>
                {({ active }) => (
                  <a
                    href="#"
                    className={`flex items-center px-4 py-2 text-sm ${
                      active ? "bg-gray-100" : "text-gray-700"
                    }`}
                  >
                    <RxActivityLog className="mr-2" /> Activity Log
                  </a>
                )}
              </MenuItem>
              <span className=" items-center ml-4 font-bold">
                {userDetails.username}
              </span>
              <hr className="border-t border-gray-200 my-1" />
              <MenuItem>
                {({ active }) => (
                  <button
                    onClick={handleProfile}
                    className={`flex items-center px-4 py-2 text-sm ${
                      active ? "bg-gray-100" : "text-gray-700"
                    }`}
                  >
                    <FaUser className="mr-2" /> My Profile
                  </button>
                )}
              </MenuItem>

              <MenuItem>
                {({ active }) => (
                  <a
                    href="#"
                    className={`flex items-center px-4 py-2 text-sm ${
                      active ? "bg-gray-100" : "text-gray-700"
                    }`}
                  >
                    <LuMessageSquareText className="mr-2" /> Message
                  </a>
                )}
              </MenuItem>
              <MenuItem>
                {({ active }) => (
                  <a
                    href="#"
                    className={`flex items-center px-4 py-2 text-sm ${
                      active ? "bg-gray-100" : "text-gray-700"
                    }`}
                  >
                    <HiOutlineDocumentCurrencyDollar className="mr-2" /> Payment
                    History
                  </a>
                )}
              </MenuItem>
              <MenuItem>
                {({ active }) => (
                  <a
                    href="#"
                    className={`flex items-center px-4 py-2 text-sm ${
                      active ? "bg-gray-100" : "text-gray-700"
                    }`}
                  >
                    <CiViewList className="mr-2" /> Order List
                  </a>
                )}
              </MenuItem>
              <MenuItem>
                {({ active }) => (
                  <a
                    href="#"
                    className={`flex items-center px-4 py-2 text-sm ${
                      active ? "bg-gray-100" : "text-gray-700"
                    }`}
                  >
                    <RiLockPasswordFill className="mr-2" /> Change Password
                  </a>
                )}
              </MenuItem>
            </div>
            <div className="py-1">
              <MenuItem>
                {({ active }) => (
                  <a
                    href="#"
                    className={`flex items-center px-4 py-2 text-sm ${
                      active ? "bg-gray-100" : "text-gray-700"
                    }`}
                  >
                    <CiLogout className="mr-2" /> Log Out
                  </a>
                )}
              </MenuItem>
            </div>
          </MenuItems>
        </Menu>
      </div>
    </nav>
  );
};

export default Header;
