import { motion } from "framer-motion";
import SmoothScrollHero from "../ui/SmoothScrollHero";
import bgImage from "../../assets/bg.jpg";
import foregroundImage from "../../assets/1.png";

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
    <SmoothScrollHero
      scrollHeight={1500}
      desktopImage={bgImage}
      mobileImage={bgImage}
      foregroundImage={foregroundImage}
      initialClipPercentage={25}
      finalClipPercentage={75}
    >
      <div className="hero">
        <motion.div
          className="hero-blur-torn"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
        >
          <div className="hero-text">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={containerVariants}
            >
              <motion.h1 variants={itemVariants}>
                OWL is your productivity system for building{" "}
                <span>ambitious software.</span>
              </motion.h1>

              <motion.div className="hero-cta-group" variants={itemVariants}>
                <a className="btn btn--primary" href="#download_app">
                  Join Beta
                </a>
                <a className="btn btn--secondary" href="#features">
                  See how it works
                </a>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </SmoothScrollHero>
  );
};

export default HeroSection;
