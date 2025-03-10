import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { SloganSection } from "./SloganSection";
import OwlIcon from "./OwlIcon";

export const HeroSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <>
    <SloganSection />
    <motion.div className="main_block" ref={ref}
    initial={{ y: -100, opacity: 0 }}
    animate={{ y: 0, opacity: isInView ? 1 : 0 }}
    transition={{ duration: 0.5 }}
    >
      <OwlIcon />
      <h2
        style={{ fontSize: "x-large", marginTop: "0px" }}
      >
        Modern task and project manager
        <br />
        for your productivity
      </h2>
    </motion.div>
    </>
  );
};
