import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretLeft } from "@fortawesome/free-solid-svg-icons";
import {
  faApple,
  faMicrosoft,
  faLinux,
  faAndroid,
} from "@fortawesome/free-brands-svg-icons";
import { useNavigate } from "react-router-dom";
import { getCachedVersion } from "./../../api/github_release";
import { motion } from "framer-motion";

const DownloadPage = () => {
  const navigate = useNavigate();
  const currentAppVersion = getCachedVersion();

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  const handleDownload = (platform) => {
    window.location.href = `https://github.com/OwlDevHub/OWL_APP/releases/latest/download/${platform}`;
  };

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
      <form className="purchase-form" onSubmit={handleSubmit}>
        <motion.div
          className="hero-content download-hero-content"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div className="hero-text">
            <motion.span className="hero-badge" variants={itemVariants}>
              {currentAppVersion} — Now Available
            </motion.span>
            <motion.h1 variants={itemVariants}>
              <span className="download-span">DOWNLOAD</span> OWL FOR YOUR
              DEVICE
            </motion.h1>
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
            <button
              className="download-button"
              onClick={() => handleDownload("owl.exe")}
            >
              <FontAwesomeIcon icon={faMicrosoft} /> WINDOWS
            </button>
            <button
              className="download-button"
              onClick={() => handleDownload("owl.dmg")}
            >
              <FontAwesomeIcon icon={faApple} /> MAC
            </button>
            <button
              className="download-button"
              onClick={() => handleDownload("owl.AppImage")}
            >
              <FontAwesomeIcon icon={faLinux} /> LINUX
            </button>
            <button
              className="download-button"
              onClick={() => handleDownload("owl.apk")}
              disabled
            >
              <FontAwesomeIcon icon={faAndroid} /> ANDROID
            </button>
          </motion.div>
        </motion.div>
      </form>
      <button className="back_btn" onClick={() => navigate(-1)}>
        <FontAwesomeIcon icon={faCaretLeft} />
      </button>
    </motion.div>
  );
};

export default DownloadPage;
