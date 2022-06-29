import { useEffect, useState, useRef } from "react";
import { useAuth } from "../../../../../../hooks/Auth";

import "./styles/avatarProfile.styles.css";

export default function AvatarProfile({ go2ProfileArea, permissions }) {
  const { signOut, user } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (user) {
      const userAvatarDiv = document.querySelector(".avatar-task");
      const userAvatar = userAvatarDiv.querySelector("img");
      userAvatar.src = user.avatar
        ? `${import.meta.env.VITE_URL_API_SERVICE}/file/src/?path=${
            user.avatar
          }`
        : `https://eu.ui-avatars.com/api/?bold=true&color=fff&background=999&size=35&name=${user.name}+${user.lastname}`;
    }
  }, [user]);

  useEffect(() => {
    /**
     * Alert if clicked on outside of element
     */
    function handleClickOutsideStartTime(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }

    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutsideStartTime);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClickOutsideStartTime);
    };
  }, [dropdownRef]);

  const handleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <li
      className={
        isDropdownOpen ? "nav-item dropdown show" : "nav-item dropdown"
      }
      onClick={() => handleDropdown()}
      ref={dropdownRef}
    >
      <a
        className="nav-link dropdown-toggle text-nowrap avatar-top"
        role="button"
        aria-expanded={isDropdownOpen ? "true" : "false"}
      >
        <div className="avatar-task">
          <img
            className="user-avatar rounded-circle mr-2 ml-2"
            src=""
            alt="Avatar"
          />
        </div>
      </a>
      <div
        className={
          isDropdownOpen
            ? "dropdown-menu dropdown-menu-small show"
            : "dropdown-menu dropdown-menu-small"
        }
      >
        {permissions?.profile?.self?.view && (
          <button
            type="button"
            className="dropdown-item"
            onClick={() => go2ProfileArea()}
          >
            <i className="material-icons">perm_identity</i>
            Profile
          </button>
        )}

        <button
          type="button"
          className="dropdown-item"
          onClick={signOut}
          id="logout"
        >
          <i className="material-icons">power_settings_new</i>
          Logout
        </button>
      </div>
    </li>
  );
}
