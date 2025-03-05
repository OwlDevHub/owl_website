import React, { useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLightbulb,
  faCloudArrowDown,
  faMoon,
  faSun,
} from "@fortawesome/free-solid-svg-icons";
import useTheme from "../hooks/useTheme";
import { motion, useInView } from "framer-motion";

const Header = () => {
  const { isDarkMode, toggleTheme } = useTheme();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <motion.header className="header" ref={ref}
    initial={{ opacity: 0, y: -40 }}
    animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : -40 }}
    transition={{ duration: 0.5 }}>
      <motion.a
        className="navbar_button"
        href="#about_app"
      >
        <FontAwesomeIcon icon={faLightbulb} /> INFO
      </motion.a>
      <motion.a
        className="navbar_button"
        href="#download_app"
      >
        <FontAwesomeIcon icon={faCloudArrowDown} /> DOWNLOAD
      </motion.a>
      <motion.button
        onClick={toggleTheme}
        className="navbar_button"
      >
        <FontAwesomeIcon icon={isDarkMode ? faMoon : faSun} />
      </motion.button>
    </motion.header>
  );
};

export default Header;
