import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";

export const SloganSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <>
    <motion.div className="float-widget" ref={ref} style={{ top: "10%", right: "8%", rotate: "-10deg"}}>
      ideas
    </motion.div>
    <motion.div className="float-widget" ref={ref} style={{ top: "15%", left: "10%", rotate: "10deg"}}>
    organization
    </motion.div>
    <motion.div className="float-widget" ref={ref} style={{ bottom: "19%", right: "13%", rotate: "-10deg"}}>
    freedom
    </motion.div>
    </>
  );
};
