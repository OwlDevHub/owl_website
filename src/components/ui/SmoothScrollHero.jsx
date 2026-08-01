import * as React from "react";
import {
  motion,
  useMotionTemplate,
  useScroll,
  useTransform,
} from "framer-motion";
import PropTypes from "prop-types";

const SmoothScrollHeroBackground = ({
  scrollHeight,
  desktopImage,
  mobileImage,
  foregroundImage,
  initialClipPercentage,
  finalClipPercentage,
}) => {
  const { scrollY } = useScroll();

  const clipStart = useTransform(
    scrollY,
    [0, scrollHeight],
    [initialClipPercentage, 0],
  );
  const clipEnd = useTransform(
    scrollY,
    [0, scrollHeight],
    [finalClipPercentage, 100],
  );

  const clipPath = useMotionTemplate`polygon(${clipStart}% ${clipStart}%, ${clipEnd}% ${clipStart}%, ${clipEnd}% ${clipEnd}%, ${clipStart}% ${clipEnd}%)`;

  const backgroundScale = useTransform(scrollY, [0, scrollHeight + 500], [1.7, 1]);

  const foregroundScale = useTransform(scrollY, [0, scrollHeight], [0.6, 1]);

  const imageStyle = {
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    scale: backgroundScale,
  };

  return (
    <motion.div
      className="ss-hero-bg"
      style={{ clipPath, willChange: "transform, opacity" }}
    >
      <motion.div
        className="ss-hero-img ss-hero-img--mobile"
        style={{
          ...imageStyle,
          backgroundImage: `url(${mobileImage})`,
        }}
      />
      <motion.div
        className="ss-hero-img ss-hero-img--desktop"
        style={{
          ...imageStyle,
          backgroundImage: `url(${desktopImage})`,
        }}
      />
      {foregroundImage && (
        <motion.div
          className="ss-hero-foreground"
          style={{ scale: foregroundScale }}
        >
          <img src={foregroundImage} alt="" />
        </motion.div>
      )}
    </motion.div>
  );
};

const SmoothScrollHero = ({
  scrollHeight = 1500,
  desktopImage,
  mobileImage,
  foregroundImage,
  initialClipPercentage = 25,
  finalClipPercentage = 75,
  children,
}) => {
  return (
    <div
      className="ss-hero"
      style={{ height: `calc(${scrollHeight}px + 100vh)` }}
    >
      <SmoothScrollHeroBackground
        scrollHeight={scrollHeight}
        desktopImage={desktopImage}
        mobileImage={mobileImage}
        foregroundImage={foregroundImage}
        initialClipPercentage={initialClipPercentage}
        finalClipPercentage={finalClipPercentage}
      />
      {children}
    </div>
  );
};

SmoothScrollHeroBackground.propTypes = {
  scrollHeight: PropTypes.number,
  desktopImage: PropTypes.string.isRequired,
  mobileImage: PropTypes.string.isRequired,
  foregroundImage: PropTypes.string,
  initialClipPercentage: PropTypes.number,
  finalClipPercentage: PropTypes.number,
};

SmoothScrollHero.propTypes = {
  scrollHeight: PropTypes.number,
  desktopImage: PropTypes.string.isRequired,
  mobileImage: PropTypes.string.isRequired,
  foregroundImage: PropTypes.string,
  initialClipPercentage: PropTypes.number,
  finalClipPercentage: PropTypes.number,
  children: PropTypes.node,
};

export default SmoothScrollHero;
