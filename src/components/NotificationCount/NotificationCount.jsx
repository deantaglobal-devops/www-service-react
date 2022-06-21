import "./styles/NotificationCount.styles.css";

export default function NotificationCount({ ...props }) {
  return (
    <>
      {props.text !== "" && props.text !== 0 && (
        <span className="notification">{props.text}</span>
      )}
    </>
  );
}
