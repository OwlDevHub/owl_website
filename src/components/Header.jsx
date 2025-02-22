import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLightbulb,
  faCloudArrowDown,
  faMoon,
  faSun,
} from "@fortawesome/free-solid-svg-icons";
import useTheme from "../hooks/useTheme";

const Header = () => {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <header className="header animate__animated animate__fadeInRight">
      <a className="navbar_button" href="#about_app">
        <FontAwesomeIcon icon={faLightbulb} /> INFO
      </a>
      <a className="navbar_button" href="#download_app">
        <FontAwesomeIcon icon={faCloudArrowDown} /> DOWNLOAD
      </a>
      <button onClick={toggleTheme} className="navbar_button">
        <FontAwesomeIcon icon={isDarkMode ? faMoon : faSun} />
      </button>
    </header>
  );
};

export default Header;
