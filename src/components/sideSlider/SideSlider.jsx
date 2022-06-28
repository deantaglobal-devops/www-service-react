import { useEffect, useState } from "react";

export default function SideSlider(props) {
  const { SliderHeader, SliderStatus, SliderWidth } = props.SIDESLIDER_PROPS;
  const [storageSize, setStorageSize] = useState(false);
  const [size, setSize] = useState({
    x: parseInt(localStorage.getItem("widthModal")) || 700,
  });

  useEffect(() => {
    localStorage.getItem("widthModal")
      ? setStorageSize(true)
      : setStorageSize(false);
    document.addEventListener("keydown", escToClose);
    const elem = document.querySelector("body");
    elem.style.overflow = "hidden";

    const sideSliderContainer = document.querySelector(
      "#side-slider-container",
    );
    sideSliderContainer.classList = "open";
    sideSliderContainer.hidden = false;

    document.querySelector(".sliderContent").hidden = false;
    document.removeEventListener("keydown", escToClose);
  }, []);

  const updateSizeModal = (size) => {
    localStorage.setItem("widthModal", size);
  };

  function escToClose(event) {
    if (event.keyCode === 27) {
      closeSlider();
    }
  }

  function closeSlider() {
    document.querySelector("#side-slider-container").classList = "closed";
    setTimeout(() => {
      document.querySelector(".sliderContent").hidden = true;
      document.querySelector("#side-slider-container").hidden = true;
      props.showSlider();
      document.querySelector("body").style.overflow = "auto";
    }, 400);
  }

  const handler = (mouseDownEvent) => {
    const startSize = size;
    const startPosition = { x: mouseDownEvent.pageX };

    function onMouseMove(mouseMoveEvent) {
      const newSize = startSize.x + startPosition.x - mouseMoveEvent.pageX;
      setSize(() => ({
        x: newSize >= 700 ? newSize : 700,
      }));
      updateSizeModal(newSize >= 700 ? newSize : 700);
    }
    function onMouseUp() {
      document.body.removeEventListener("mousemove", onMouseMove);
    }

    document.body.addEventListener("mousemove", onMouseMove);
    document.body.addEventListener("mouseup", onMouseUp, { once: true });
  };

  return (
    <>
      <div
        className={
          SliderWidth === "small"
            ? "sliderContent sliderContent-small shadow"
            : SliderWidth === "big"
            ? "sliderContent shadow sliderContent-big"
            : "sliderContent shadow"
        }
        style={{ width: size.x }}
      >
        {props.draggable && (
          <div className={`${!storageSize && "showtooltip"} icon-draggable`}>
            <div className="tooltip-content">
              <i className="material-icons-outlined " onMouseDown={handler}>
                code
              </i>
              {!storageSize && (
                <span className="tooltip-msgintro">
                  {props.toolTipMsgIntro}
                </span>
              )}
            </div>
          </div>
        )}

        <header className="header-details">
          {/* If SliderHeader exists then display */}
          {SliderHeader && <h2>{SliderHeader}</h2>}

          <button onClick={() => closeSlider()} title="Close">
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

        <div className="content">{props.children}</div>
      </div>

      <div onClick={() => closeSlider()} className="backdrop" />
    </>
  );
}
