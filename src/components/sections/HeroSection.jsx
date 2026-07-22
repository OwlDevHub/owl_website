import { motion } from "framer-motion";

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.15,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] },
  },
};

const HeroSection = () => {
  return (
    <div className="hero">
      <motion.div
        className="hero-content"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="hero-text">
          <motion.h1 variants={itemVariants}>
            Meet Your New
            <br />
            <span>PRODUCTIVITY</span>
            <br />
            System
          </motion.h1>

          <motion.div className="hero-cta-group" variants={itemVariants}>
            <a className="hero-cta-primary" href="#download_app">
              Get Early Access - Free
            </a>
            <a className="hero-cta-secondary" href="#features">
              See how it works
            </a>
          </motion.div>

          <motion.div className="hero-trust" variants={itemVariants}>
            <span className="hero-trust-line">
              Built for developers who ship. No bloat. No distractions.
            </span>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default HeroSection;
