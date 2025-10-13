import React, { useState, useEffect, useMemo } from "react";
import PropTypes from "prop-types";

function CustomCarousel({ children, intervalMs = 2500 }) {
  const slides = useMemo(() => React.Children.toArray(children), [children]);
  const count = slides.length;
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const clampIndex = (index) => {
    if (count === 0) return 0;
    if (index < 0) return count - 1;
    if (index >= count) return 0;
    return index;
  };

  const slideNext = () => {
    setActiveIndex((prev) => clampIndex(prev + 1));
  };

  const slidePrev = () => {
    setActiveIndex((prev) => clampIndex(prev - 1));
  };

  useEffect(() => {
    if (count <= 1) return;
    if (isPaused) return;
    const id = setInterval(() => {
      setActiveIndex((prev) => clampIndex(prev + 1));
    }, intervalMs);
    return () => clearInterval(id);
  }, [count, isPaused, intervalMs]);

  return (
    <div
      className="ui"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div
        className="slider__track"
        style={{ transform: `translateX(-${activeIndex * 100}%)` }}
        aria-live="polite"
        aria-atomic="true"
      >
        {slides.map((item, index) => (
          <div
            className="slider__item"
            key={item.key ?? item.props?.id ?? `slider-item-${index}`}
            aria-hidden={activeIndex !== index}
          >
            {item}
          </div>
        ))}
      </div>
      <button
        className="slider__btn-prev"
        onClick={(e) => {
          e.preventDefault();
          slidePrev();
        }}
        aria-label="Previous slide"
      ></button>
      <button
        className="slider__btn-next"
        onClick={(e) => {
          e.preventDefault();
          slideNext();
        }}
        aria-label="Next slide"
      ></button>
    </div>
  );
}

CustomCarousel.propTypes = {
  children: PropTypes.node.isRequired,
  intervalMs: PropTypes.number,
};

export default CustomCarousel;
