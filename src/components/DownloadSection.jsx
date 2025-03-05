import React, { useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faCloudArrowDown } from "@fortawesome/free-solid-svg-icons";
import { motion, useInView } from "framer-motion";

const DownloadSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <motion.div className="download_app" id="download_app" ref={ref}>
      <div className="download-buttons">
        <motion.a
          href="#"
          className="purchase_button"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <h3>
            <FontAwesomeIcon icon={faHeart} /> PURCHASE
          </h3>
          <h3 className="button_subblock">5$/mo</h3>
        </motion.a>
        <motion.a
          href="https://github.com/Nighty3098/OWL_APP/releases"
          className="download_button"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <h3>
            <FontAwesomeIcon icon={faCloudArrowDown} /> DOWNLOAD
          </h3>
          <h3 className="button_subblock">TRIAL</h3>
        </motion.a>
      </div>
    </motion.div>
  );
};

export default DownloadSection;
