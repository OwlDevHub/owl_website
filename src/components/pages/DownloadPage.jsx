import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretLeft } from "@fortawesome/free-solid-svg-icons";
import {
  faApple,
  faMicrosoft,
  faLinux,
  faAndroid,
} from "@fortawesome/free-brands-svg-icons";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { motion } from "framer-motion";
import { getRandomBackground } from "../../utils/randomBackground";

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

const DownloadPage = () => {
  const navigate = useNavigate();
  const [bgImage] = useState(() => getRandomBackground());

  const handleDownload = (platform) => {
    window.location.href = `https://github.com/OwlDevHub/OWL_APP/releases/latest/download/${platform}`;
  };

  return (
    <div className="hero hero--download">
      <div
        className="hero--download__bg"
        style={{ backgroundImage: `url(${bgImage})` }}
        aria-hidden="true"
      />
      <div className="hero--download__overlay" aria-hidden="true" />

      <div className="hero-text">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <motion.h1 variants={itemVariants}>
            <span className="download-span">DOWNLOAD</span> OWL
          </motion.h1>

          <motion.div className="hero-download" variants={itemVariants}>
            <button
              type="button"
              className="btn btn--primary"
              onClick={() => handleDownload("owl.exe")}
            >
              <FontAwesomeIcon icon={faMicrosoft} /> WINDOWS
            </button>
            <button
              type="button"
              className="btn btn--secondary"
              onClick={() => handleDownload("owl.dmg")}
              disabled
            >
              <FontAwesomeIcon icon={faApple} /> MAC
            </button>
            <button
              type="button"
              className="btn btn--primary"
              onClick={() => handleDownload("owl.AppImage")}
            >
              <FontAwesomeIcon icon={faLinux} /> LINUX
            </button>
            <button
              type="button"
              className="btn btn--secondary"
              onClick={() => handleDownload("owl.apk")}
              disabled
            >
              <FontAwesomeIcon icon={faAndroid} /> ANDROID
            </button>
          </motion.div>
        </motion.div>
      </div>

      <button className="back_btn" onClick={() => navigate(-1)}>
        <FontAwesomeIcon icon={faCaretLeft} />
      </button>
    </div>
  );
};

export default DownloadPage;
