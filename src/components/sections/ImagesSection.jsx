import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import CustomSlider from "./ImageGallery";
import images from "../../data/images";

const ImagesSection = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const rotateX = useTransform(scrollYProgress, [0, 1], [60, -60]);

  return (
    <motion.div
      ref={ref}
      className="slider-section"
      style={{ rotateX, perspective: 1200 }}
    >
      <CustomSlider>
        {images.map((image) => (
          <img src={image.imgURL} alt={image.imgAlt} key={image.imgURL} />
        ))}
      </CustomSlider>
    </motion.div>
  );
};

export default ImagesSection;
