import { motion } from "framer-motion";
import { useRef } from "react";
import { useInView } from "framer-motion";

const variants = {
  fadeUp: {
    hidden: { opacity: 0, y: 40 },
    visible: (i = 0) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.6,
        ease: [0.16, 1, 0.3, 1],
      },
    }),
  },
  fadeIn: {
    hidden: { opacity: 0 },
    visible: (i = 0) => ({
      opacity: 1,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        ease: "easeOut",
      },
    }),
  },
  scaleIn: {
    hidden: { opacity: 0, scale: 0.9 },
    visible: (i = 0) => ({
      opacity: 1,
      scale: 1,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        ease: [0.16, 1, 0.3, 1],
      },
    }),
  },
};

const Reveal = ({
  children,
  variant = "fadeUp",
  delay = 0,
  className,
  as = "div",
  once = true,
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once, margin: "-60px" });

  const v = variants[variant] || variants.fadeUp;

  const Component = motion[as];

  return (
    <Component
      ref={ref}
      className={className}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={v}
      custom={delay}
    >
      {children}
    </Component>
  );
};

const RevealStagger = ({
  children,
  variant = "fadeUp",
  className,
  staggerDelay = 0.1,
  once = true,
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once, margin: "-60px" });

  const v = variants[variant] || variants.fadeUp;

  return (
    <motion.div
      ref={ref}
      className={className}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: staggerDelay,
            delayChildren: 0.1,
          },
        },
      }}
    >
      {children}
    </motion.div>
  );
};

const RevealItem = ({ children, variant = "fadeUp", className }) => {
  const v = variants[variant] || variants.fadeUp;
  return (
    <motion.div className={className} variants={v}>
      {children}
    </motion.div>
  );
};

export { Reveal, RevealStagger, RevealItem };
export default Reveal;
