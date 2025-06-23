import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { OwlIcon } from '../ui';

export const HeroSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <div>
      <motion.div
        className="main_block"
        ref={ref}
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: isInView ? 1 : 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col flex-center gap-0 w-auto h-auto text-center">
          <h2>
            Meet Your
            <br />
            New Personal
            <br />
            Productivity App
          </h2>
        </div>
        <OwlIcon />
      </motion.div>
    </div>
  );
};
