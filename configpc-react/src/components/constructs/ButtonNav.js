import React from "react";
import Button from "react-bootstrap/Button";

const ButtonNav = ({ text, variant, glow }) => {
  return (
    <Button
      className={`glowing-btn-nav ${glow ? "glow-effect" : "no-glow"}`}
      style={{ "--button-color": variant }}
    >
      <span className="glowing-txt">{text}</span>
    </Button>
  );
};

export default ButtonNav;