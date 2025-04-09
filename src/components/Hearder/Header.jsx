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
import useToken from "../hooks/useToken";

const Header = () => {
  const navigate = useNavigate();
  const [userDetails, setUserDetails] = useState({
    username: "",
    userType: "",
    photo: null,
  });
  const [url, getTokenLocalStorage] = useToken();
  const token = getTokenLocalStorage();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await fetch(`${url}/auth/profile/`, {
          headers: {
            Authorization: `Token ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setUserDetails({
            username: data?.data?.username || "User",
            userType: data?.data?.user_type?.name || "Role",
            photo: data?.data?.photo || null,
          });

          
        } else {
          console.error("Failed to fetch user details");
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };

    fetchUserProfile();
  }, [token, url]);

  const handleNavigation = (pageLink) => {
    navigate(`/${pageLink}`);
  };

  const handleLogOut = async () => {
    try {
      const response = await fetch(`${url}/auth/user/logout/`, {
        headers: {
          Authorization: `Token ${token}`,
        },
      });

      const data = await response.json();

      if (data.success) {
        localStorage.removeItem("office_token");
        navigate("/login");
      } else {
        alert("Logout failed: " + data.message);
      }
    } catch (error) {
      console.error("Error logging out:", error);
      alert("An error occurred. Please try again.");
    }
  };
 
  return (
    <nav className="fixed top-0 left-0 w-full z-50 flex justify-between items-center bg-white shadow-md px-4 sm:px-6 md:px-8 py-2">
      {/* Logo Section */}
      <div className="flex-shrink-0">
        <img
          onClick={() => handleNavigation("dashboard")}
          src="/assets/Images/Images-nav/logo-image.jpg"
          alt="Company Logo"
          className="h-10 sm:h-12 w-auto ml-4 sm:ml-8 md:ml-24 cursor-pointer"
        />
      </div>

      {/* User Info & Menu */}
      <div className="flex items-center space-x-2 sm:space-x-3">
        <p className="text-gray-600 text-xs sm:text-sm underline truncate max-w-[100px] sm:max-w-[150px]">
          {userDetails.userType}
        </p>

        <Menu as="div" className="relative inline-block text-left">
          <MenuButton className="flex items-center gap-1 sm:gap-2 rounded-full bg-gray-100 px-3 sm:px-4 py-1 sm:py-2 text-xs sm:text-sm font-medium text-gray-700 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            <span className="truncate max-w-[80px] sm:max-w-[120px]">
              {userDetails.username}
            </span>
            <img
              src={
                userDetails.photo 
                  ? `${url}/${userDetails.photo}` 
                  : "/public/assets/Images/Images-nav/images.png" 
              }
              alt={`${userDetails.username}'s profile photo`}
              // Fallback on error
              className="h-8 sm:h-10 w-8 sm:w-10 rounded-full object-cover ml-2 sm:ml-4"
            />
          </MenuButton>

          <MenuItems className="absolute right-0 z-10 mt-2 w-48 sm:w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none">
            <div className="py-1">
              <MenuItem>
                {({ active }) => (
                  <button
                    onClick={() => handleNavigation("activity-log")}
                    className={`flex items-center px-3 sm:px-4 py-2 text-xs sm:text-sm ${
                      active ? "bg-gray-100" : "text-gray-700"
                    } w-full text-left`}
                  >
                    <RxActivityLog className="mr-2 text-sm sm:text-base" />{" "}
                    Activity Log
                  </button>
                )}
              </MenuItem>
              <div className="flex items-center px-3 sm:px-4 py-2">
                <span className="font-bold text-xs sm:text-sm truncate">
                  {userDetails.username}
                </span>
              </div>
              <hr className="border-t border-gray-200 my-1" />
              <MenuItem>
                {({ active }) => (
                  <button
                    onClick={() => handleNavigation("profile")}
                    className={`flex items-center px-3 sm:px-4 py-2 text-xs sm:text-sm ${
                      active ? "bg-gray-100" : "text-gray-700"
                    } w-full text-left`}
                  >
                    <FaUser className="mr-2 text-sm sm:text-base" /> My Profile
                  </button>
                )}
              </MenuItem>
              <MenuItem>
                {({ active }) => (
                  <button
                    onClick={() => handleNavigation("message")}
                    className={`flex items-center px-3 sm:px-4 py-2 text-xs sm:text-sm ${
                      active ? "bg-gray-100" : "text-gray-700"
                    } w-full text-left`}
                  >
                    <LuMessageSquareText className="mr-2 text-sm sm:text-base" />{" "}
                    Message
                  </button>
                )}
              </MenuItem>
              <MenuItem>
                {({ active }) => (
                  <button
                    onClick={() => handleNavigation("payment-history")}
                    className={`flex items-center px-3 sm:px-4 py-2 text-xs sm:text-sm ${
                      active ? "bg-gray-100" : "text-gray-700"
                    } w-full text-left`}
                  >
                    <HiOutlineDocumentCurrencyDollar className="mr-2 text-sm sm:text-base" />{" "}
                    Payment History
                  </button>
                )}
              </MenuItem>
              <MenuItem>
                {({ active }) => (
                  <button
                    onClick={() => handleNavigation("order-list")}
                    className={`flex items-center px-3 sm:px-4 py-2 text-xs sm:text-sm ${
                      active ? "bg-gray-100" : "text-gray-700"
                    } w-full text-left`}
                  >
                    <CiViewList className="mr-2 text-sm sm:text-base" /> Order
                    List
                  </button>
                )}
              </MenuItem>
              <MenuItem>
                {({ active }) => (
                  <button
                    onClick={() => handleNavigation("change-password")}
                    className={`flex items-center px-3 sm:px-4 py-2 text-xs sm:text-sm ${
                      active ? "bg-gray-100" : "text-gray-700"
                    } w-full text-left`}
                  >
                    <RiLockPasswordFill className="mr-2 text-sm sm:text-base" />{" "}
                    Change Password
                  </button>
                )}
              </MenuItem>
            </div>
            <div className="py-1">
              <MenuItem>
                {({ active }) => (
                  <button
                    onClick={handleLogOut}
                    className={`flex items-center px-3 sm:px-4 py-2 text-xs sm:text-sm ${
                      active ? "bg-gray-100" : "text-gray-700"
                    } w-full text-left`}
                  >
                    <CiLogout className="mr-2 text-sm sm:text-base" /> Log Out
                  </button>
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
