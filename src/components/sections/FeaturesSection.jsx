import React, { useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPenRuler,
  faRotate,
  faDollarSign,
  faUsers,
  faWifi,
} from "@fortawesome/free-solid-svg-icons";
import { faApple } from "@fortawesome/free-brands-svg-icons";
import { motion, useInView } from "framer-motion";
import { MOTION_LIST } from "../../styles/motionConfig";

const defaultFeatures = [
  { icon: faPenRuler, text: "Minimalistic\ndesign" },
  { icon: faRotate, text: "Fast\nsync" },
  { icon: faWifi, text: "Offline\nmode" },
  { icon: faUsers, text: "Collaborative\nwork" },
  { icon: faDollarSign, text: "Free\ntrial" },
  { icon: faApple, text: "Cross\nplatform" },
];

const FeaturesSection = ({ title = "FEATURES", items = defaultFeatures }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <div
      className="content"
      style={{ maxHeight: "100%", minHeight: "100vh", height: "100vh" }}
    >
      <motion.h1
        transition={{ duration: 0.6, delay: 0.1, ease: [0.4, 0, 0.2, 1] }}
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 100 }}
      >
        {title}
      </motion.h1>
      <div className="widget_blocks" ref={ref}>
        {items.map((feature, idx) => {
          const key = `${feature.text}-${feature.icon.iconName || feature.icon.prefix}`;
          return (
            <motion.div
              key={key}
              className="square_block"
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 100 }}
              transition={MOTION_LIST(idx)}
            >
              <span className="emoji">
                <FontAwesomeIcon icon={feature.icon} />
              </span>
              <h1>
                {feature.text.split("\n").map((line) => (
                  <React.Fragment key={line}>
                    {line}
                    <br />
                  </React.Fragment>
                ))}
              </h1>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default FeaturesSection;
