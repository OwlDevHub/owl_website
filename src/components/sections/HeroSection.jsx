import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { OwlIcon } from "../ui";
import { MOTION } from "../../styles/motionConfig";

const NotifyLink = () => {
  return (
    <motion.a
      href="#download_app"
      className="notify"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      style={{
        backgroundColor: "var(--green)",
        padding: "var(--space-1)",
        borderRadius: "0px",
        color: "var(--bg)",
        fontSize: "1rem",
        lineHeight: "2rem",
        position: "absolute",
        top: "80px",
        overflow: "hidden",
        whiteSpace: "nowrap",
        display: "block",
        width: "calc(100vw - var(--space-1) - var(--space-1))"
      }}
    >
      The service is currently under development. You can submit a request and receive a notification when we launch it.
    </motion.a>
  );
};

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
        <NotifyLink />
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
