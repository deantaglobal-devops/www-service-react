import React, { useEffect } from 'react';

import './styles/modalForm.styles.css';

export default function ModalForm({ show, className, children }) {
  useEffect(() => {
    if (show) {
      document.body.classList.add('modal-open');
    }

    return () => {
      document.body.classList.remove('modal-open');
    };
  }, []);

  const showHideClassName = show
    ? 'modal display-block '
    : 'modal display-none';

  return (
    <div className={showHideClassName}>
      <section className={className ? `modal-main ${className}` : 'modal-main'}>
        <div className="modal-content">{children}</div>
      </section>
    </div>
  );
}
