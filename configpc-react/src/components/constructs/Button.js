import React from "react";
import { FaEye } from "react-icons/fa";
import Button from "react-bootstrap/Button";
import "./../../styles/css/button.js"

const Button = () => {
  return (
    <Button>
      <FaEye className="icon" />
      Voir les détails
    </Button>
  );
};

export default Button;
