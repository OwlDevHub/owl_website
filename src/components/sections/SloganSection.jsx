import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLightbulb,
  faListCheck,
  faFeather,
  faClock,
} from "@fortawesome/free-solid-svg-icons";

export const Dock = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <div className="dock">
      <motion.div
        className="dock-item"
        style={{ backgroundColor: "var(--yellow)"}}
        ref={ref}
        animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : -50 }}
        transition={{ duration: 0.5 }}
      >
        <FontAwesomeIcon className="icon" icon={faLightbulb} />
      </motion.div>
      <motion.div
        className="dock-item"
        style={{ backgroundColor: "var(--red)"}}
        ref={ref}
        animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : -50 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <FontAwesomeIcon className="icon" icon={faListCheck} />
      </motion.div>
      <motion.div
        className="dock-item"
        style={{ backgroundColor: "var(--purple)"}}
        ref={ref}
        animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 50 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <FontAwesomeIcon className="icon" icon={faFeather} />
      </motion.div>
      <motion.div
        className="dock-item"
        style={{ backgroundColor: "var(--green)"}}
        ref={ref}
        animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 50 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <FontAwesomeIcon className="icon" icon={faClock} />
      </motion.div>
    </div>
  );
};

export const RText = ({ text, angle }) => {
  return (
    <motion.div className="app_name" style={{ transform: `rotate(${angle}deg)`, width: "100%", maxWidth: "650px", marginBottom: "50px", marginTop: "50px" }}>
      <h1>{text}</h1>
    </motion.div>
  );
};

