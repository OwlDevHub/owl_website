import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCaretLeft,
  faEnvelopeOpenText,
  faFeather,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const DownloadPage = () => {
  const navigate = useNavigate();

  const itemVariants = {
    hidden: { opacity: 0, y: 18 },
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
    <div className="renaissance-hero">
      <div className="ren-column ren-column--left" aria-hidden="true" />
      <div className="ren-column ren-column--right" aria-hidden="true" />

      <motion.div
        className="ren-content"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div
          className="ren-ornament"
          variants={itemVariants}
          aria-hidden="true"
        >
          <span className="ren-rule" />
          <span className="ren-motif">
            <FontAwesomeIcon icon={faFeather} />
          </span>
          <span className="ren-rule" />
        </motion.div>

        <motion.div className="ren-seal" variants={itemVariants} aria-hidden="true">
          <div className="ren-seal__ring">
            <div className="ren-seal__inner">
              <span className="ren-seal__star">&#10022;</span>
              <span className="ren-seal__text">Closed Beta</span>
            </div>
          </div>
        </motion.div>

        <motion.h1 className="ren-title" variants={itemVariants}>
          Join the <span className="ren-title__script">OWL</span> Beta
        </motion.h1>

        <motion.p className="ren-desc" variants={itemVariants}>
          OWL is in a limited closed beta right now. Leave your email and
          we'll notify you the moment we open up new spots.
        </motion.p>

        <motion.div variants={itemVariants}>
          <a className="ren-cta" href="/#download_app">
            <FontAwesomeIcon icon={faEnvelopeOpenText} /> Request Beta Access
          </a>
        </motion.div>

        <motion.div
          className="ren-ornament"
          variants={itemVariants}
          aria-hidden="true"
        >
          <span className="ren-rule" />
          <span className="ren-motif">&#10022;</span>
          <span className="ren-rule" />
        </motion.div>
      </motion.div>

      <button className="back_btn" onClick={() => navigate(-1)}>
        <FontAwesomeIcon icon={faCaretLeft} />
      </button>
    </div>
  );
};

export default DownloadPage;
