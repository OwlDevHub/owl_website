import { motion } from "framer-motion";
import { useRef } from "react";
import { useInView } from "framer-motion";

const VARIANTS = {
  fadeUp: {
    hidden: { opacity: 0, y: 24 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] },
    },
  },
  fadeIn: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.4, ease: "easeOut" },
    },
  },
};

const Reveal = ({
  children,
  variant = "fadeUp",
  className,
  as = "div",
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });
  const v = VARIANTS[variant];
  const Component = motion[as];

  return (
    <Component
      ref={ref}
      className={className}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={v}
    >
      {children}
    </Component>
  );
};

const RevealStagger = ({
  children,
  className,
  staggerDelay = 0.06,
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <motion.div
      ref={ref}
      className={className}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: staggerDelay,
            delayChildren: 0.05,
          },
        },
      }}
    >
      {children}
    </motion.div>
  );
};

const RevealItem = ({ children, variant = "fadeUp", className }) => {
  const v = VARIANTS[variant];
  return (
    <motion.div className={className} variants={v}>
      {children}
    </motion.div>
  );
};

export { Reveal, RevealStagger, RevealItem };
export default Reveal;
