import { useState, useEffect } from "react";
// import './styles/loading.styles.css';

export default function Toast({
  text,
  type,
  time,
  handleToastOnClick = () => {},
}) {
  const [isToastClosed, setIsToastClosed] = useState(false);

  useEffect(() => {
    setTimeout(() => handleOnClick(), time || 5000);
  }, []);

  const handleOnClick = () => {
    setIsToastClosed(true);
    handleToastOnClick();
  };

  return (
    <div
      className={
        isToastClosed
          ? "deanta-toast-alert hidden"
          : type == "success"
          ? "deanta-toast-alert success"
          : type == "fail"
          ? "deanta-toast-alert fail"
          : "deanta-toast-alert warning"
      }
    >
      <i className="material-icons-outlined">
        {type == "success" ? "done" : type == "fail" ? "cancel" : "report"}
      </i>
      <p className="deanta-toast-text">{text}</p>
      <button
        type="button"
        className="deanta-toast-close"
        onClick={(e) => handleOnClick(e)}
      >
        <i className="material-icons-outlined">close</i>
      </button>
    </div>
  );
}
