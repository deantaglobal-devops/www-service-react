import React from 'react';

import './styles/buttonGroupLanUI.styles.css';

export default function ButtonGroupLanUI({ text, ...props }) {
  return (
    <>
      <div className="undefined">{props.children}</div>
    </>
  );
}
