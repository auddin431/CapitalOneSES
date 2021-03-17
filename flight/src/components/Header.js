import React from "react";
import "./Header.css";
import { IoMdAirplane } from "react-icons/io";

const Header = (props) => {
  return (
    <div className="header">
      {props.title} <IoMdAirplane />
    </div>
  );
};

export default Header;
