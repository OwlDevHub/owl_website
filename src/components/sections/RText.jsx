import React from "react";
import { motion } from "framer-motion";
import { MOTION } from '../../styles/motionConfig';

const RText = ({ text, angle }) => {
  return (
    <motion.div style={{ rotate: angle, maxWidth: "200px" }} className={`app_name`} initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={MOTION}>
      <h1>{text}</h1>
    </motion.div>
  );
};

export default RText; 
