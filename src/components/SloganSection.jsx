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
      <motion.h1>
        <p className="slogan-title">OWL:</p>
        {textLines.map((line, index) => (
          <span key={index} className="slogan-line">
            {line.text}
          </span>
        ))}
      </motion.h1>
    </div>
  );
};
