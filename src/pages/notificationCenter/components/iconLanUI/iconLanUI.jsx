import "./styles/iconLanUI.styles.css";

export default function Icon({ text, onClick, ...props }) {
  let loadingProp = "";
  if (props.isLoading && props.icon === "refresh") {
    loadingProp = "loading";
  }

  return (
    <i className={`icon ${loadingProp} material-icons-outlined`}>
      {props.icon}
    </i>
  );
}
