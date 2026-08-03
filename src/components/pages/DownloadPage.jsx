import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretLeft, faEnvelopeOpenText } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const DownloadPage = () => {
  const navigate = useNavigate();

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] },
    },
  };

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.15,
      },
    },
  };

  return (
    <motion.div className="hero">
      <motion.div
        className="hero-content download-hero-content"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div className="hero-text">
          <motion.span className="hero-badge" variants={itemVariants}>
            Closed Beta
          </motion.span>
          <motion.h1 variants={itemVariants}>
            <span className="download-span">JOIN THE</span> OWL BETA
          </motion.h1>
          <motion.p
            className="section-desc"
            style={{ maxWidth: "46ch" }}
            variants={itemVariants}
          >
            OWL is in a limited closed beta right now. Leave your email and
            we'll notify you the moment we open up new spots.
          </motion.p>
        </motion.div>
        <motion.div
          className="hero-download"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            duration: 0.6,
            delay: 0.3,
            ease: [0.25, 0.1, 0.25, 1],
          }}
        >
          <a className="download-button" href="/#download_app">
            <FontAwesomeIcon icon={faEnvelopeOpenText} /> REQUEST BETA ACCESS
          </a>
        </motion.div>
      </motion.div>
      <button className="back_btn" onClick={() => navigate(-1)}>
        <FontAwesomeIcon icon={faCaretLeft} />
      </button>
    </motion.div>
  );
};

export default DownloadPage;
