import { useState, useEffect } from "react";
import "./styles/tooltip.styles.css";

export function Tooltip(props) {
  let timeout;
  const [active, setActive] = useState(false);

  useEffect(() => {
    return () => {
      // ComponentWillUnmount in Class Component
      setActive(false);
    };
  }, []);

  const showTip = () => {
    timeout = setTimeout(() => {
      setActive(true);
    }, props.delay || 200);
  };

  const hideTip = () => {
    clearInterval(timeout);
    setActive(false);
  };

  return (
    <div
      className={`Tooltip-Wrapper ${
        props.direction === "bottom-title-large" && "behind"
      }`}
      // When to show the tooltip
      onMouseEnter={showTip}
      onMouseLeave={hideTip}
    >
      {/* Wrapping */}
      {props.children}
      {active && (
        <div className={`Tooltip-Tip ${props.direction || "top"}`}>
          {/* Content */}
          {props.content}
        </div>
      )}
    </div>
  );
}
