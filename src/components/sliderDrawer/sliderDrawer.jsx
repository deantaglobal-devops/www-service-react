import { useEffect } from "react";
import Backdrop from "./backdrop";

import "./styles/sliderDrawer.styles.css";

export default function SlideDrawer(props) {
  let drawerClasses = "side-drawer";

  if (props.show) {
    drawerClasses = "side-drawer open";
  }

  // Add event listeners
  useEffect(() => {
    document.addEventListener("keydown", escToClose);
    // Remove event listeners on cleanup
    return () => {
      window.removeEventListener("keydown", escToClose);
    };
  }, []);

  const escToClose = (event) => {
    // if the keycode is 27 (ESC key)
    if (event.keyCode === 27) {
      closeSlider();
    }
  };

  const closeSlider = () => {
    document.body.style.overflow = "auto";
    props.close();
  };

  return (
    <>
      <div className={drawerClasses}>
        <div className="slideContent">
          <header className="header-details">
            {/* If SliderHeader exists then display */}
            {props.SliderHeader && <h2>{props.SliderHeader}</h2>}

            <button onClick={() => closeSlider()} className="button-close">
              <i
                className="material-icons-outlined close-details"
                data-toggle="tooltip"
                data-placement="left"
                title="Close"
              >
                close
              </i>
            </button>
          </header>
          {props.children}
        </div>
      </div>

      {props.children && <Backdrop close={() => closeSlider()} />}
    </>
  );
}
