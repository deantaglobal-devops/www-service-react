import Icon from "../iconLanUI/iconLanUI";

import "./styles/buttonLanUI.styles.css";

export default function ButtonLanUI({ text, ...props }) {
  let textChildren = "";
  if (props.children) {
    textChildren = props.children;
  }

  let isThereText = true;
  // if not content within the button
  if (textChildren === null && !text && !iconProp) {
    isThereText = false;
    console.error("Please pass a text prop or child");
  }

  let isDisabled = "";
  if (props.isLoading || props.disabled) {
    isDisabled = true;
  }

  let iconProp = "";
  if (props.icon) {
    iconProp = "icon";
  }

  function onClick() {
    // This throws an error if no onClick function passed
    // Runs props.onClick, if there is

    if (typeof props.onClick !== "function") {
      console.error(
        `
					You need to pass a function as a Prop.
					eg. () => myFunction()

					eg. <Button onClick={() => myFunction()}/>
				`,
      );
      return;
    }

    props.onClick();
  }

  return (
    <button
      className="button text-standard"
      disabled={isDisabled}
      onClick={() => onClick()}
    >
      {props.icon && <Icon {...props} />}

      {/* // Only Render a span if there is textChildren || text */}

      {textChildren && textChildren !== "" && <span>{textChildren}</span>}
      {text && <span>{text}</span>}

      {
        // Just some dummy content if you don't pass in any content
        !isThereText && (
          <span style={{ backgroundColor: "orangered", color: "white" }}>
            You should pass in some text
          </span>
        )
      }
    </button>
  );
}
