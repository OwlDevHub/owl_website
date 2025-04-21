import React, { useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPenRuler,
  faRotate,
  faComment,
  faScrewdriverWrench,
  faDollarSign,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";
import { faApple } from "@fortawesome/free-brands-svg-icons";
import { motion, useInView } from "framer-motion";
import CustomSlider from "./ImageGallery";
import images from "./../data/images";

const features = [
  { icon: faPenRuler, text: "Custom\ndesign" },
  { icon: faRotate, text: "Fast\nsynchronization" },
  { icon: faComment, text: "Instant\nnotifications" },
  { icon: faUsers, text: "Collaborative\nwork" },
  { icon: faDollarSign, text: "Free\ntrial version" },
  { icon: faApple, text: "Cross\nplatform" },
];

export const Features = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <div className="content">
      <div className="widget_blocks" ref={ref}>
        {features.map((feature, index) => (
          <motion.div
            key={index}
            className="square_block"
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 100 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <span className="emoji">
              <FontAwesomeIcon icon={feature.icon} />
            </span>
            <h1>
              {feature.text.split("\n").map((line, i) => (
                <React.Fragment key={i}>
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

export const Images = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <motion.div
      className="content"
      ref={ref}
      initial={{ opacity: 0, y: -100 }}
      animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : -100 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      <CustomSlider>
        {images.map((image, index) => {
          return <img key={index} src={image.imgURL} alt={image.imgAlt} />;
        })}
      </CustomSlider>
    </motion.div>
  );
};
