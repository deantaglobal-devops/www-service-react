import React from "react";
import { Tooltip } from "../../../../components/tooltip/tooltip";
import "./styles/menuTabLanUI.styles.css";

export default function MenuTabLanUI({ ...props }) {
  function onClick() {
    if (typeof props.onClick !== "function") {
      console.error(
        `You need to pass a function as a Prop.
					eg. () => myFunction()

					eg. <MenuTab onClick={() => myFunction()}/>
				`,
      );
      return;
    }

    props.onClick();
  }

  return (
    <button
      onClick={() => onClick()}
      className={`undefined ${
        props.active ? "icon-text-bold active" : "icon-text"
      } MenuTab_tab`}
    >
      {props.columnNumber !== 2 ? (
        <Tooltip content={props.titleProject} direction="bottom max-wdth">
          <p>{props.text}</p>
        </Tooltip>
      ) : (
        <p>{props.text}</p>
      )}

      {props.secondColumn && (
        <span className="second_column">{props.secondColumn}</span>
      )}
    </button>
  );
}
