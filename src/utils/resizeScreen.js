export async function blockFullScreenHide() {
  document.getElementById("mainSideBar").style.pointerEvents = "none";
  document.getElementById("mainSideBar").style.opacity = 0.2;

  document.querySelector(".main-navbar.sticky-top").style.pointerEvents =
    "none";
  document.querySelector(".main-navbar.sticky-top").style.opacity = 0.2;

  document.querySelector(".deanta-toast-alert").style.pointerEvents = "none";
  document.querySelector(".deanta-toast-alert").style.opacity = 0.2;

  document.querySelector(".page-header").style.pointerEvents = "none";
  document.querySelector(".page-header").style.opacity = 0.2;

  document.querySelector(".main-project-navigation").style.pointerEvents =
    "none";
  document.querySelector(".main-project-navigation").style.opacity = 0.2;

  return true;
}

export async function blockFullScreenShow() {
  document.getElementById("mainSideBar").style.pointerEvents = "none";
  document.getElementById("mainSideBar").style.opacity = 0.2;

  document.querySelector(".main-navbar.sticky-top").style.pointerEvents =
    "none";
  document.querySelector(".main-navbar.sticky-top").style.opacity = 0.2;

  document.querySelector(".deanta-toast-alert").style.pointerEvents = "none";
  document.querySelector(".deanta-toast-alert").style.opacity = 0.2;

  document.querySelector(".page-header").style.pointerEvents = "none";
  document.querySelector(".page-header").style.opacity = 0.2;

  document.querySelector(".main-project-navigation").style.pointerEvents =
    "none";
  document.querySelector(".main-project-navigation").style.opacity = 0.2;

  return true;
}

export async function fullScreenToggle() {
  // console.log(document.querySelector(".main-content .main-navbar").classList);
  document.querySelector(".main-content .main-navbar").classList.toggle("off");
  document.querySelector(".main-sidebar").classList.toggle("off");
  document.querySelector(".page-header").classList.toggle("off");
  document.querySelector(".main-content").classList.toggle("off");
  document.querySelector("iframe#iframe-id").classList.toggle("focus-mode-up");
}
