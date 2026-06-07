import { motion } from "framer-motion";
import { OwlIcon } from "../ui";

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
        </div>

        <motion.div className="hero-visual" variants={itemVariants}>
          <div className="hero-icon-frame">
            <div className="hero-icon-glow" />
            <div className="hero-icon-inner hero-float">
              <OwlIcon />
            </div>
          </div>
          <div className="hero-visual-label">OWL — Project OS</div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default HeroSection;
