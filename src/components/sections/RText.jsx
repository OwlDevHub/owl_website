import React from "react";
import { motion } from "framer-motion";
import { MOTION } from "../../styles/motionConfig";
import PropTypes from "prop-types";

const RText = (props) => {
  const { text, angle } = props;
  return (
    <motion.div
      style={{ rotate: angle, maxWidth: "200px" }}
      className={`app_name`}
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={MOTION}
    >
      <h1>{text}</h1>
    </motion.div>
  );
};

RText.propTypes = {
  text: PropTypes.string.isRequired,
  angle: PropTypes.number.isRequired,
};

export default RText;
