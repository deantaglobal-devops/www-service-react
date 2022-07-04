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
  // If Focus mode is ON

  // console.log(
  //   "document.getElementsByClassName(.main-project-navigation).getAttribute(style)",
  //   document
  //     .querySelector(".main-project-navigation")
  //     .classList.contains("opened"),
  // );
  if (
    document
      .querySelector(".main-project-navigation")
      .classList.contains("opened")
  ) {
    console.log("here 1");
    document.querySelector(".main-content .main-navbar").classList.add("off");
    document.querySelector(".main-sidebar").classList.add("off");
    document.querySelector(".page-header").classList.add("off");
    document.querySelector(".main-content").classList.add("off");
    document
      .querySelector(".main-project-navigation")
      .classList.remove("opened");
    document.querySelector(".main-project-navigation").classList.add("closed");

    // document.querySelector(".main-project-navigation").style.display = "none";
    document.querySelector("iframe").animate({ top: "-30" }, 500);
    document
      .querySelector("iframe")
      .style.setProperty("height", "calc(100% + 80px)");
  } else {
    console.log("here 2");
    document.querySelector(".main-project-navigation").classList.add("opened");
    // document.querySelector(".main-project-navigation").style.display = "block";

    document
      .querySelector(".main-content .main-navbar")
      .classList.remove("off");
    document.querySelector(".main-sidebar").classList.remove("off");
    document.querySelector(".page-header").classList.remove("off");
    document.getElementById("main-content").classList.remove("off");
    document
      .querySelector(".main-project-navigation")
      .classList.remove("closed");

    document.querySelector("iframe").animate({ top: "130" }, 500);
    document
      .querySelector("iframe")
      .style.setProperty("height", "calc(100% - 80px)");
  }
  // if ($(".main-project-navigation").is(":visible")) {
  //   $(".main-navbar, .main-sidebar, .page-header, .main-content").addClass(
  //     "off",
  //   );
  //   $(".main-project-navigation").hide();
  //   $("iframe").animate({ top: "-30" }, 500);
  //   $("iframe").css({
  //     height: "calc(100% + 80px)",
  //   });
  // } else {
  //   // If Focus mode is OFF
  //   $("iframe").animate({ top: "130" }, 500, () => {
  //     $(".main-project-navigation").show();
  //     $(".main-navbar, .main-sidebar, .page-header, .main-content").removeClass(
  //       "off",
  //     );
  //   });
  //   $("iframe").css({
  //     height: "calc(100% - 80px)",
  //   });
  // }
  return true;
}
