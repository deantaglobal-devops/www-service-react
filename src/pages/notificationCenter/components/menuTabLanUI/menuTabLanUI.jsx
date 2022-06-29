import React from 'react';
import './styles/menuTabLanUI.styles.css';

export default function MenuTabLanUI({ ...props }) {
  function onClick() {
    if (typeof props.onClick !== 'function') {
      console.error(
        `You need to pass a function as a Prop.
					eg. () => myFunction()

					eg. <MenuTab onClick={() => myFunction()}/>
				`
      );
      return;
    }

    props.onClick();
  }

  return (
    <button
      onClick={() => onClick()}
      className={`undefined ${
        props.active ? `icon-text-bold active` : 'icon-text'
      } MenuTab_tab`}
    >
      <span>{props.text}</span>

      {props.secondColumn && (
        <span className="second_column">{props.secondColumn}</span>
      )}
    </button>
  );
}
