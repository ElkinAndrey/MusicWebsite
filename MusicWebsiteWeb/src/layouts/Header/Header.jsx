import React from "react";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <div style={{ background: "#cccccc" }}>
      <Link to={"/"}>Песни</Link>
      <Link to={"/singer"}>Исполнители</Link>
      <Link to={"/genres"}>Жанры</Link>
    </div>
  );
};

export default Header;
