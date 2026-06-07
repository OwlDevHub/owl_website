import { motion } from "framer-motion";
import { OwlIcon } from "../ui";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
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
        <motion.div className="hero-text" variants={containerVariants}>
          <motion.div className="hero-badge" variants={itemVariants}>
            <span>✦</span>
            Early Access — Free Trial
          </motion.div>

          <motion.h1 variants={itemVariants}>
            Meet Your New <span>Productivity</span> OS
          </motion.h1>

          <motion.p className="hero-sub" variants={itemVariants}>
            OWL is a powerful platform for managing projects, tasks, and teams.
            Built for developers who value speed, simplicity, and clean design.
          </motion.p>

          <motion.div className="hero-cta-group" variants={itemVariants}>
            <a className="hero-cta-primary" href="#download_app">
              Get Early Access
            </a>
            <a className="hero-cta-secondary" href="#features">
              Explore Features
            </a>
          </motion.div>
        </motion.div>

        <motion.div className="hero-visual" variants={itemVariants}>
          <div className="hero-icon-frame">
            <div className="hero-icon-glow" />
            <motion.div
              className="hero-icon-inner"
              animate={{
                y: [0, -6, 0],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <OwlIcon />
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default HeroSection;
