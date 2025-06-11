import React, { useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLightbulb,
  faCloudArrowDown,
  faScaleBalanced,
} from "@fortawesome/free-solid-svg-icons";
import { motion, useInView } from "framer-motion";
import { Link } from "react-router-dom";

const Header = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <motion.header
      className="header"
      ref={ref}
      initial={{ opacity: 0, y: -40 }}
      animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : -40 }}
      transition={{ duration: 0.5 }}
    >
      <motion.a
        href="/terms"
        className="navbar_button"
        target="_blank"
      >
        <FontAwesomeIcon icon={faScaleBalanced} />
        TERMS
      </motion.a>
      <motion.a className="navbar_button" href="/privacy" target="_blank">
        <FontAwesomeIcon icon={faLightbulb} /> PRIVACY
      </motion.a>
      <Link to="/download" className="navbar_button">
        <FontAwesomeIcon icon={faCloudArrowDown} /> DOWNLOAD
      </Link>
    </motion.header>
  );
};

export default Header;
