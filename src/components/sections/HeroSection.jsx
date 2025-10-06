import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { OwlIcon } from "../ui";
import { MOTION } from "../../styles/motionConfig";

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
        <motion.a
          href="#download_app"
          style={{
            backgroundColor: "var(--green)",
            padding: "var(--space-1)",
            borderRadius: "0px",
            color: "var(--bg)",
            fontSize: "1rem",
            lineHeight: "2rem",
            position: "absolute",
            top: "80px",
            width: "calc(100% - var(--space-1) - var(--space-1))",
          }}
        >
          <div className="notify">
            The service is currently under development. You can submit a request
            and receive a notification when we launch it.
          </div>
        </motion.a>
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
