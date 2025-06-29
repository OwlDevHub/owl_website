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
import RText from "./RText";
import { MOTION_LIST } from "../../styles/motionConfig";

const features = [
  { icon: faPenRuler, text: "Custom\ndesign" },
  { icon: faRotate, text: "Fast\nsynchronization" },
  { icon: faWifi, text: "Offline\nmode" },
  { icon: faUsers, text: "Collaborative\nwork" },
  { icon: faDollarSign, text: "Free\ntrial version" },
  { icon: faApple, text: "Cross\nplatform" },
];

const FeaturesSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <div className="content large_block">
      <RText text={"FEATURES"} angle={-5} />
      <div className="widget_blocks" ref={ref}>
        {features.map((feature, index) => (
          <motion.div
            className="square_block"
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 100 }}
            transition={MOTION_LIST(index)}
          >
            <span className="emoji">
              <FontAwesomeIcon icon={feature.icon} />
            </span>
            <h1>
              {feature.text.split("\n").map((line, i) => (
                <React.Fragment>
                  {line}
                  <br />
                </React.Fragment>
              ))}
            </h1>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default FeaturesSection;
