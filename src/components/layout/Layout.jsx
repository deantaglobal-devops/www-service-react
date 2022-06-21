import { useState } from "react";
import AppProvider from "../../hooks/index";
import { SideBar } from "./components/sideBar/SideBar";
import { NavBar } from "./components/navBar/NavBar";
import { Profile } from "../profile/ProfileReactJS";

import "../../styles/bootstrap/bootstrap.min.css";
import "../../styles/shards-dashboards.1.3.1.min.css";
import "../../styles/style.css";

export default function Layout({ children, iconActive, permissions, user }) {
  const [modalProfile, setModalProfile] = useState(false);
  const [openSideBarMobile, setOpenSideBarMobile] = useState(false);

  const handleProfileModal = () => {
    setModalProfile(!modalProfile);
  };

  const handleOpenSideBarMobile = () => {
    setOpenSideBarMobile(true);
  };

  return (
    <AppProvider>
      <div className="container-fluid icon-sidebar-nav">
        <div className="row">
          <SideBar
            iconActive={iconActive}
            permissions={permissions}
            openSideBarMobile={openSideBarMobile}
            user={user}
          />

          <main className="main-content col background-white" id="main-content">
            <NavBar
              permissions={permissions}
              handleOpenProfileModal={() => handleProfileModal()}
              handleOpenSideBarMobile={() => handleOpenSideBarMobile()}
            />
            <div className="main-content-container container-fluid px-5 mt-4 pb-5">
              {children}

              {/* Profile needs to be here */}
              <div id="side-slider-container" hidden>
                {modalProfile && (
                  <Profile
                    TOKEN_PROPS={user}
                    handleCloseModal={() => handleProfileModal()}
                  />
                )}
              </div>
            </div>
          </main>
        </div>
      </div>
    </AppProvider>
  );
}
