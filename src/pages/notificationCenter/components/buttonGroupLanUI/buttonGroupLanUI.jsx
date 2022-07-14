import React from "react";

import "./styles/buttonGroupLanUI.styles.css";

export default function ButtonGroupLanUI({ text, ...props }) {
  return <div className="undefined footer-btn">{props.children}</div>;
}
