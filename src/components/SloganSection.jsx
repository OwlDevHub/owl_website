import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";

const textLines = [
  { text: "- Your ideas", delay: 0.4 },
  { text: "- Your organization", delay: 0.5 },
  { text: "- Your freedom", delay: 0.6 },
];

export const SloganSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <div className="slogan_section" ref={ref}>
      <motion.h1
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: isInView ? 1 : 0, x: isInView ? 0 : 50 }}
        transition={{ duration: 0.5 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <p
          className="slogan-title"
        >
          OWL:
        </p>
        {textLines.map((line, index) => (
          <span
            key={index}
            className="slogan-line"
          >
            {line.text}
          </span>
        ))}
      </motion.h1>
    </div>
  );
};
