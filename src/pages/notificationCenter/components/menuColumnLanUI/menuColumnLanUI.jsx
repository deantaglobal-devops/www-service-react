import React from 'react';
import './styles/menuColumn.styles.css';

export default function MenuColumnLanUI({ ...props }) {
  // Add Custom Class if passed In as Props
  let customClass = '';
  if (props.class) {
    customClass = props.class;
  }

  return (
    <div className={`undefined ${customClass} MenuColumn_menu`}>
      {/* // If title passed in, render */}
      {props.title && <h2 className="h2">{props.title}</h2>}

      {props.children}
    </div>
  );
}
