import { useState } from "react";
import { Link } from "react-router-dom";

import "../../../../styles/side-slider.css";
import "./styles/sideBar.styles.css";

export function SideBar({ iconActive, permissions, openSideBarMobile, user }) {
  const [isMouseHover, setIsMouveHover] = useState(false);

  const dashboardPermission = permissions?.dashboard?.view !== "0";
  const calendarPermission = permissions?.calendar?.view !== "0";
  const booksPermission = permissions?.books?.view !== "0";
  const journalsPermission = permissions?.journals?.view !== "0";

  const handleMouseOver = (e) => {
    e.preventDefault();
    setIsMouveHover(true);
  };
  const handleMouseLeave = (e) => {
    e.preventDefault();

    setIsMouveHover(false);
  };

  return (
    //  Main Sidebar
    <aside
      className={
        openSideBarMobile
          ? "main-sidebar col-12 col-md-3 col-lg-2 px-0 open"
          : "main-sidebar col-12 col-md-3 col-lg-2 px-0"
      }
      onMouseOver={(e) => handleMouseOver(e)}
      onMouseLeave={(e) => handleMouseLeave(e)}
    >
      <div className="main-navbar">
        <nav className="navbar align-items-stretch navbar-light bg-white flex-md-nowrap p-0">
          <Link
            to={dashboardPermission ? "/" : "#"}
            className="navbar-brand w-100 mr-0"
          >
            <div className="d-table">
              <svg
                width="112"
                height="25"
                viewBox="0 0 112 25"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                style={{ marginLeft: `${18}px`, marginTop: `${6}px` }}
              >
                <g id="lanstad-logo">
                  <g
                    id="anstad-group"
                    className={
                      isMouseHover || openSideBarMobile
                        ? "anstad-default anstad-animate"
                        : "anstad-default"
                    }
                  >
                    <g id="anstad">
                      <path d="M33.3358 23.6422V5.91055H28.0323V7.79554H27.9684C26.9141 6.03835 24.7415 5.30352 22.7927 5.30352C17.4572 5.30352 13.8789 9.58468 13.8789 14.7604C13.8789 20.032 17.3294 24.2492 22.7927 24.2492C24.7096 24.2492 27.0099 23.5464 27.9684 21.7253H28.0323V23.6422H33.3358ZM28.0323 14.7604C28.0323 17.3163 26.1792 19.2971 23.5914 19.2971C21.0994 19.2971 19.1824 17.2844 19.1824 14.8243C19.1824 12.3003 20.9716 10.2556 23.5594 10.2556C26.1473 10.2556 28.0323 12.1725 28.0323 14.7604Z" />
                      <path d="M50.879 23.6422V12.5559C50.879 10.4792 50.5276 8.24282 48.8343 6.83707C47.6841 5.8786 45.7991 5.30352 44.2975 5.30352C42.1569 5.30352 40.5915 5.97445 39.4732 7.79554H39.4093V5.91055H34.4573V23.6422H39.7608V13.9936C39.7608 11.885 40.3359 10.2876 42.7959 10.2876C45.1921 10.2876 45.5755 11.9808 45.5755 13.9617V23.6422H50.879Z" />
                      <path d="M65.1869 18.2109C65.1869 11.9489 56.2731 13.5144 56.2731 10.7348C56.2731 9.93611 57.0719 9.55273 57.7747 9.55273C58.7012 9.55273 59.4041 9.90417 59.4361 10.8946H64.6437C64.2923 7.12461 61.385 5.30352 57.8386 5.30352C54.4201 5.30352 50.9696 7.4441 50.9696 11.1502C50.9696 13.6422 53.0782 15.016 55.1869 15.7828C55.9536 16.0703 56.7204 16.3259 57.4872 16.5815C58.4457 16.9649 59.8834 17.3483 59.8834 18.6262C59.8834 19.5527 58.829 20 58.0303 20C56.976 20 56.1773 19.4569 56.0175 18.3706H50.746C51.1613 22.2684 54.2603 24.2492 57.9664 24.2492C61.5767 24.2492 65.1869 22.2045 65.1869 18.2109Z" />
                      <path d="M74.0055 9.93611V5.91055H71.4496V0H66.1461V5.91055H63.5263V9.93611H66.1461V23.6422H71.4496V9.93611H74.0055Z" />
                      <path d="M91.7032 23.6422V5.91055H86.3997V7.79554H86.3358C85.2815 6.03835 83.109 5.30352 81.1601 5.30352C75.8246 5.30352 72.2463 9.58468 72.2463 14.7604C72.2463 20.032 75.6968 24.2492 81.1601 24.2492C83.077 24.2492 85.3774 23.5464 86.3358 21.7253H86.3997V23.6422H91.7032ZM86.3997 14.7604C86.3997 17.3163 84.5467 19.2971 81.9588 19.2971C79.4668 19.2971 77.5499 17.2844 77.5499 14.8243C77.5499 12.3003 79.339 10.2556 81.9269 10.2556C84.5147 10.2556 86.3997 12.1725 86.3997 14.7604Z" />
                      <path d="M111.291 23.6422V0H105.988V7.41215C104.55 5.9425 102.825 5.30352 100.78 5.30352C95.4445 5.30352 91.994 9.58468 91.994 14.7285C91.994 19.9681 95.4445 24.2173 100.876 24.2173C102.953 24.2173 105.061 23.6103 106.179 21.7253H106.243V23.6422H111.291ZM106.275 14.6965C106.275 17.3163 104.39 19.2652 101.738 19.2652C99.0867 19.2652 97.2975 17.2844 97.2975 14.6965C97.2975 12.1086 99.2464 10.2556 101.802 10.2556C104.358 10.2556 106.275 12.1406 106.275 14.6965Z" />
                    </g>
                  </g>
                  <g
                    id="rectangles-group"
                    className={
                      isMouseHover || openSideBarMobile
                        ? "rectangles-group-default rectangles-group-animate"
                        : "rectangles-group-default"
                    }
                  >
                    <rect
                      id="rectangle-481"
                      x="8.39453"
                      y="8.51611"
                      width="6.96775"
                      height="6.96775"
                    />
                    <rect
                      id="rectangle-482"
                      x="8.39453"
                      width="6.96775"
                      height="6.96775"
                    />
                    <rect
                      id="rectangle-483"
                      x="16.9102"
                      width="6.96775"
                      height="6.96775"
                    />
                    <rect
                      id="rectangle-484"
                      x="16.9102"
                      y="8.51611"
                      width="6.96775"
                      height="6.96775"
                    />
                    <rect
                      id="rectangle-485"
                      x="16.9102"
                      y="17.0317"
                      width="6.96775"
                      height="6.96775"
                    />
                  </g>
                  <g id="letter-l-group">
                    <path
                      id="letter-L"
                      d="M6.02734 0H0.0273438V24H15.0273V18H6.02734V0Z"
                    />
                  </g>
                </g>
              </svg>
            </div>
          </Link>
        </nav>
      </div>
      <div className="nav-wrapper">
        {/* Dashboard */}
        <ul className="nav nav--no-borders flex-column">
          {dashboardPermission && (
            <li className="nav-item">
              <Link
                to="/dashboard"
                className={
                  iconActive === "Dashboard" ? "nav-link active" : "nav-link"
                }
              >
                <i className="material-icons-outlined">dashboard</i>
                <span>Dashboard</span>
              </Link>
            </li>
          )}

          {/* Calendar */}
          {calendarPermission && (
            <li className="nav-item">
              <Link
                to="/calendar"
                className={
                  iconActive === "Calendar" ? "nav-link active" : "nav-link"
                }
              >
                <i className="material-icons-outlined">today</i>
                <span>Calendar</span>
              </Link>
            </li>
          )}

          {/* Books */}
          {booksPermission && (
            <li className="nav-item">
              <Link
                to="/dashboard/books"
                className={
                  iconActive === "Books" ? "nav-link active" : "nav-link"
                }
              >
                <i className="material-icons-outlined">collections_bookmark</i>
                <span>Books</span>
              </Link>
            </li>
          )}

          {/* Journals */}
          {journalsPermission && (
            <li className="nav-item">
              <Link
                to="/dashboard/journals"
                className={
                  iconActive === "Journals" ? "nav-link active" : "nav-link"
                }
              >
                <i className="material-icons-outlined">library_books</i>
                <span>Journals</span>
              </Link>
            </li>
          )}
        </ul>

        {/* Configuration */}
        {user?.admin_user && (
          <ul className="nav nav--no-borders flex-column configuration-link">
            <li className="nav-item">
              <Link
                to="/configuration/panel"
                className={
                  iconActive === "Configuration"
                    ? "nav-link active"
                    : "nav-link"
                }
              >
                <i className="material-icons-outlined">settings</i>
                <span>Configuration</span>
              </Link>
            </li>
          </ul>
        )}
      </div>
    </aside>
    // End Main Sidebar
  );
}
