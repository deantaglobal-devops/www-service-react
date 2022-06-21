import { useEffect } from "react";
import "./styles/backdrop.styles.css";

export default function Backdrop(props) {
  // Add event listeners
  useEffect(() => {
    // Body not allowed to scroll when slide is opened
    document.body.style.overflow = "hidden";
    // Remove event listeners on cleanup
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  const closeSlider = () => {
    props.close();
  };

  return <div className="backdrop" onClick={() => closeSlider()} />;
}
