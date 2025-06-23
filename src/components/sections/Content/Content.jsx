import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import WIOF from "../WIOF";
import RText from "../RText";
import { MOTION } from '../../../styles/motionConfig';

const Content = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <motion.div
      className="content enhanced-content"
      ref={ref}
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: isInView ? 1 : 0, x: isInView ? 0 : 100 }}
      transition={MOTION}
    >
      <RText text={"THE OWL"} angle={5} />
      <br />
      <h2>OWL is a powerful and intuitive platform for managing projects, tasks, and teams, created specifically for developers and IT teams.</h2>
      <WIOF />
    </motion.div>
  );
};

export default Content; 
