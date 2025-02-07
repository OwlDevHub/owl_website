import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLightbulb, faCloudArrowDown } from '@fortawesome/free-solid-svg-icons'

const Header = () => {
  return (
    <header className="header animate__animated animate__bounceInRight">
      <div className="header-left">
        <h1 className="header_title">OWL - YOUR PRODUCTIVITY APP</h1>
      </div>
      <nav>
        <a className="navbar_button" href="#about_app">
        <FontAwesomeIcon icon={faLightbulb} /> INFO
        </a>
        <a className="navbar_button" href="#download_app">
        <FontAwesomeIcon icon={faCloudArrowDown} /> DOWNLOAD
        </a>
      </nav>
    </header>
  );
};

export default Header;
