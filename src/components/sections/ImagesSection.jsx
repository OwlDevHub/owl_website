import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import CustomSlider from "./ImageGallery";
import images from '../../data/images';
import { MOTION } from '../../styles/motionConfig';

const ImagesSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <motion.div
      className="content"
      ref={ref}
      initial={{ opacity: 0, x: -100 }}
      animate={{ opacity: isInView ? 1 : 0, x: isInView ? 0 : -100 }}
      transition={MOTION}
    >
      <CustomSlider>
        {images.map((image) => (
          <img src={image.imgURL} alt={image.imgAlt} />
        ))}
      </CustomSlider>
    </motion.div>
  );
};

export default ImagesSection; 
