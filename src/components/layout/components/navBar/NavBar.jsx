import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { api } from "../../../../services/api";
import AvatarProfile from "./components/avatarProfile/avatarProfile";
import BellNotifications from "./components/bellNotifications/bellNotifications";

import Modal from "../../../Modal/modal";
import { useAuth } from "../../../../hooks/Auth";

import "../../../../styles/search.css";
import "../../../../styles/style-toc.css";
import "./styles/NavBar.styles.css";

export function NavBar({
  permissions,
  handleOpenProfileModal,
  handleOpenSideBarMobile,
}) {
  const [alertSession, setAlertSession] = useState(false);
  const [sessionExpiredModal, setSessionExpiredModal] = useState(false);
  const [timerSession, setTimerSession] = useState(60);
  const [isMagicCode, setIsMagicCode] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [searchData, setSearchData] = useState([]);
  const controllerRef = useRef();
  const searchBarInput = document.querySelector(".navbar-search");
  const clearSearchButton = document.querySelector(
    ".main-navbar__search .input-group .clear-search",
  );

  const { signOut } = useAuth();
  const { origin } = window.location;

  useEffect(() => {
    const timer =
      alertSession &&
      setInterval(() => setTimerSession(timerSession - 1), 1000);
    if (timerSession === 0) {
      setSessionExpiredModal(true);
      setTimeout(() => {
        removeTokens();
      }, 2000);
    }
    return () => clearInterval(timer);
  }, [timerSession, alertSession]);

  useEffect(() => {
    setIsMagicCode(!!window.localStorage.getItem("magic-code"));
  }, []);

  useEffect(() => {
    updateActivity();

    const timeInterval = setInterval(() => {
      const lastAcivity = localStorage.getItem("lastActvity");
      const difTime = Math.abs(new Date(lastAcivity) - new Date());
      const secToExpire = Math.floor(difTime / 1000);
      if (secToExpire >= 900) {
        setAlertSession(true);
        clearInterval(timeInterval);
      }
    }, 1000);

    document.addEventListener("mousemove", () => {
      updateActivity();
    });
    document.addEventListener("click", () => {
      updateActivity();
    });
  });

  const removeTokens = () => {
    localStorage.removeItem("magic-code");
    localStorage.removeItem("lanstad-token");
    localStorage.removeItem("lanstad-user");
  };

  const updateActivity = () => {
    localStorage.setItem("lastActvity", new Date());
  };

  const go2ProfileArea = () => {
    handleOpenProfileModal();
  };

  const searchResult = async (e) => {
    setSearchInput(e.target.value);

    if (e.target.value === "") {
      setSearchData([]);
      clearSearchButton.hidden = true;
    } else {
      clearSearchButton.hidden = false;
    }

    // If Enter Key, don't do anything
    if (e.keyCode === 13) {
      e.preventDefault();
      return;
    }

    // If Directional arrow keys, don't run new search
    if (
      e.keyCode === 37 ||
      e.keyCode === 38 ||
      e.keyCode === 39 ||
      e.keyCode === 40
    ) {
      return;
    }

    // Abort request if already exists
    if (controllerRef.current) {
      controllerRef.current.abort();
    }
    const controller = new AbortController();
    controllerRef.current = controller;

    if (e.target.value !== "") {
      clearSearchButton.title = "Loading";
      clearSearchButton.innerHTML = '<i class="material-icons">refresh</i>';

      try {
        const search = await api
          .post(
            "/project/search/result",
            { searchfield: e.target.value },
            {
              signal: controllerRef.current?.signal,
            },
          )
          .then((response) => response.data);

        clearSearchButton.title = "Clear Search";
        clearSearchButton.innerHTML = '<i class="material-icons">close</i>';

        if (search.length > 0) {
          setSearchData(search);
        } else {
          setSearchData([{ id: 0, result: "Not found" }]);
        }

        controllerRef.current = null;
      } catch (error) {
        console.log(error);
      }
    }
  };

  const clearSearch = () => {
    setSearchInput("");
    setSearchData([]);
    searchBarInput.focus();
  };

  return (
    <div className="main-navbar sticky-top bg-white">
      {/* Main Navbar */}
      <nav className="navbar align-items-stretch navbar-light flex-md-nowrap p-0">
        <form
          action="#"
          className="main-navbar__search d-none d-md-flex d-lg-flex mb-0"
        >
          <div className="input-group input-group-navbar input-group-seamless ss_form">
            <i className="material-icons-outlined">search</i>

            <input
              className="navbar-search form-control"
              type="search"
              placeholder="Search by project title"
              aria-label="Search"
              value={searchInput}
              onChange={(event) => searchResult(event)}
            />
            <button hidden type="button" className="search" title="Search">
              <i className="material-icons">search</i>
            </button>

            <button
              hidden
              type="button"
              className="clear-search"
              title="Clear Search"
              onClick={(e) => clearSearch(e)}
            >
              <i className="material-icons">close</i>
            </button>
          </div>
          {searchData.length > 0 &&
          searchInput !== "" &&
          searchData[0].id !== 0 ? (
            <ul className="results shadow">
              {searchData?.map((data) => (
                <li key={data?.id}>
                  {/* <Link to={data.url}> */}
                  <a href={`${origin}/${data.url}`}>
                    <p className="search-bar-title">{data?.project_title}</p>
                    <span className="projectType">{data?.project_type}</span>
                  </a>
                  {/* </Link> */}
                </li>
              ))}
            </ul>
          ) : (
            searchData.length > 0 &&
            searchInput !== "" &&
            searchData[0].id === 0 && (
              <ul className="results shadow">
                <li>No result found</li>
              </ul>
            )
          )}
        </form>

        <ul className="navbar-nav border-left flex-row ml-auto">
          <BellNotifications />
          <AvatarProfile
            go2ProfileArea={() => go2ProfileArea()}
            permissions={permissions}
          />
        </ul>
        <nav className="nav">
          <a
            href="#"
            className="nav-link nav-link-icon toggle-sidebar d-sm-inline d-md-none text-center border-left"
            data-toggle="collapse"
            data-target=".header-navbar"
            aria-expanded="false"
            aria-controls="header-navbar"
            onClick={() => handleOpenSideBarMobile()}
          >
            <i className="material-icons">&#xE5D2;</i>
          </a>
        </nav>
      </nav>
      {alertSession && (
        <Modal
          displayModal={alertSession}
          hideClose
          classCustom="greyoutmodal"
          title={
            !sessionExpiredModal
              ? "Your session is about to expire"
              : "Your session has expired"
          }
          content={
            !sessionExpiredModal ? (
              <p>
                Click continue if you would like to stay logged in.
                <br />
                <b>{timerSession} seconds left.</b>
              </p>
            ) : isMagicCode ? (
              <p>
                Please click on the passkey link in the email you received to
                <br />
                regain access to Lanstad
              </p>
            ) : (
              <p>
                Please refresh this page or visit{" "}
                <a
                  href="#"
                  onClick={() => {
                    signOut();
                  }}
                  className="link"
                >
                  Login Page
                </a>
                <br />
                to regain access to Lanstad
              </p>
            )
          }
          Button2Text={!sessionExpiredModal ? "Continue" : ""}
          handleButton2Modal={() => {
            setAlertSession(false);
            setTimerSession(60);
          }}
        />
      )}
    </div>
  );
}
