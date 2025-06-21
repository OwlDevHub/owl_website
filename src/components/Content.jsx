import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCode,
  faRocket,
  faUser,
  faGraduationCap,
} from "@fortawesome/free-solid-svg-icons";

export const Content = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <motion.div
      className="content enhanced-content"
      ref={ref}
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: isInView ? 1 : 0, x: isInView ? 0 : 100 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      <h1>OWL - an intuitive project management platform</h1>
      <div className="flex_1">
        <p className="content-text">
          <span className="highlight">OWL</span> is a powerful and intuitive
          platform for managing projects, tasks, and teams, created specifically
          for developers and IT teams.
        </p>
      </div>
    </motion.div>
  );
};

export const WIOF = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <motion.div
      className="content enhanced-content"
      ref={ref}
      initial={{ opacity: 0, y: -100 }}
      animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : -100 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      <div className="content-header">
        <h1>Who is OWL for?</h1>
      </div>
      <ul className="content-list">
        <motion.li
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: isInView ? 0 : 100, opacity: isInView ? 1 : 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
        >
          <div
            style={{
              width: "100%",
              display: "flex",
              alignContent: "center",
              alignItems: "center",
              justifyContent: "flex-start",
              lineHeight: "3.5rem",
            }}
          >
            <FontAwesomeIcon icon={faCode} className="list-icon" /> Developers
          </div>
          automation of routine, flexible analytics
        </motion.li>
        <motion.li
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: isInView ? 0 : 100, opacity: isInView ? 1 : 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
        >
          <div
            style={{
              width: "100%",
              display: "flex",
              alignContent: "center",
              alignItems: "center",
              justifyContent: "flex-start",
              lineHeight: "3.5rem",
            }}
          >
            <FontAwesomeIcon icon={faRocket} className="list-icon" /> Businesses
          </div>
          control over projects, deadlines, and resources
        </motion.li>
        <motion.li
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: isInView ? 0 : 100, opacity: isInView ? 1 : 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
        >
          <div
            style={{
              width: "100%",
              display: "flex",
              alignContent: "center",
              alignItems: "center",
              justifyContent: "flex-start",
              lineHeight: "3.5rem",
            }}
          >
            <FontAwesomeIcon icon={faUser} className="list-icon" /> Freelancers
          </div>
          personal efficiency, easy task and project tracking
        </motion.li>
        <motion.li
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: isInView ? 0 : 100, opacity: isInView ? 1 : 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
        >
          <div
            style={{
              width: "100%",
              display: "flex",
              alignContent: "center",
              alignItems: "center",
              justifyContent: "flex-start",
              lineHeight: "3.5rem",
            }}
          >
            <FontAwesomeIcon icon={faGraduationCap} className="list-icon" />{" "}
            Educational projects
          </div>
          tracking the progress of students and teams
        </motion.li>
      </ul>
    </motion.div>
  );
};
