import React from "react";

function ProgressBar(props) {
  const { bgcolor, completed } = props;

  const containerStyles = {
    height: 8,
    width: "50%",
    backgroundColor: "#e0e0de",
    borderRadius: 50,
    marginTop: 10,
    marginLeft: 50,
    marginRight: 50,
  };

  const fillerStyles = {
    height: "100%",
    width: `${completed}%`,
    backgroundColor: bgcolor,
    borderRadius: "inherit",
    textAlign: "right",
    transition: "width 1s ease-in-out",
  };

  const labelStyles = {
    padding: 5,
    color: "white",
    fontWeight: "bold",
  };

  return (
    <div style={containerStyles}>
      <div style={fillerStyles} />
    </div>
  );
}

export default ProgressBar;
