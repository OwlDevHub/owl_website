import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { OwlIcon } from '../ui';
import { MOTION } from '../../styles/motionConfig';

const HeroSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <div>
      <motion.div
        className="main_block"
        ref={ref}
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: isInView ? 1 : 0 }}
        transition={MOTION}
      >
        <div className="flex flex-col flex-center gap-0 w-auto h-auto text-center">
          <h2>
            Meet Your New
            <br />
            Personal Productivity
            <br />
            App
          </h2>
        </div>
        <OwlIcon />
      </motion.div>
    </div>
  );
};

export default HeroSection;
