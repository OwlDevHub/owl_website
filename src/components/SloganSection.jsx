import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLightbulb, faListCheck, faFeather, faClock } from "@fortawesome/free-solid-svg-icons";

export const SloganSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <>
    <motion.div 
      className="float-widget" 
      ref={ref}
      style={{
        top: "10%", 
        right: "8%", 
        rotate: "-15deg",
      }}
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : -50 }}
      transition={{ duration: 0.5 }}
    >
      <FontAwesomeIcon className="icon" icon={faLightbulb} />
      <p>ideas</p>
    </motion.div>
    <motion.div 
      className="float-widget"
      ref={ref} 
      style={{ 
        top: "15%",
        left: "10%", 
        rotate: "10deg",
      }}
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : -50 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <FontAwesomeIcon className="icon" icon={faListCheck} />
      <p>organization</p>
    </motion.div>
    <motion.div 
      className="float-widget" 
      ref={ref} 
      style={{ 
        bottom: "19%", 
        right: "13%", 
        rotate: "-12deg",
      }}
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 50 }}
      transition={{ duration: 0.5, delay: 0.4 }}
    >
      <FontAwesomeIcon className="icon" icon={faFeather} />
      <p>freedom</p>
    </motion.div>
    <motion.div 
      className="float-widget" 
      ref={ref} 
      style={{ 
        bottom: "14%", 
        left: "20%", 
        rotate: "16deg",
      }}
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 50 }}
      transition={{ duration: 0.5, delay: 0.4 }}
    >
      <FontAwesomeIcon className="icon" icon={faClock} />
      <p>productivity</p>
    </motion.div>
    </>
  );
};
