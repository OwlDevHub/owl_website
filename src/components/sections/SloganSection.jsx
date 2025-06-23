import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLightbulb,
  faListCheck,
  faFeather,
  faClock,
} from "@fortawesome/free-solid-svg-icons";
import { MOTION, MOTION_LIST } from '../../styles/motionConfig';

export const Dock = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <div className="dock">
      <motion.div
        className="dock-item bg-yellow"
        ref={ref}
        animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : -50 }}
        transition={MOTION}
      >
        <FontAwesomeIcon className="icon" icon={faLightbulb} />
      </motion.div>
      <motion.div
        className="dock-item bg-red"
        ref={ref}
        animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : -50 }}
        transition={MOTION_LIST(1)}
      >
        <FontAwesomeIcon className="icon" icon={faListCheck} />
      </motion.div>
      <motion.div
        className="dock-item bg-purple"
        ref={ref}
        animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 50 }}
        transition={MOTION_LIST(2)}
      >
        <FontAwesomeIcon className="icon" icon={faFeather} />
      </motion.div>
      <motion.div
        className="dock-item bg-green"
        ref={ref}
        animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 50 }}
        transition={MOTION_LIST(3)}
      >
        <FontAwesomeIcon className="icon" icon={faClock} />
      </motion.div>
    </div>
  );
};

export const RText = ({ text, angle }) => {
  const rotateClass = angle === 5 ? "rotate-5" : angle === -5 ? "rotate--5" : "rotate-0";
  return (
    <motion.div className={`app_name w-100 max-w-650 mb-50 mt-50 ${rotateClass}`} initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={MOTION}>
      <h1>{text}</h1>
    </motion.div>
  );
};

