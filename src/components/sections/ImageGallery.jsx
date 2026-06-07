import React, { useState, useEffect, useMemo } from "react";
import PropTypes from "prop-types";

const clampIndex = (index, count) => {
  if (count === 0) return 0;
  if (index < 0) return count - 1;
  if (index >= count) return 0;
  return index;
};

function CustomCarousel({ children, intervalMs = 3000 }) {
  const slides = useMemo(() => React.Children.toArray(children), [children]);
  const count = slides.length;
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const slideNext = () => {
    setActiveIndex((prev) => clampIndex(prev + 1, count));
  };

  const slidePrev = () => {
    setActiveIndex((prev) => clampIndex(prev - 1, count));
  };

  useEffect(() => {
    if (count <= 1) return;
    if (isPaused) return;
    const id = setInterval(() => {
      setActiveIndex((prev) => clampIndex(prev + 1, count));
    }, intervalMs);
    return () => clearInterval(id);
  }, [count, isPaused, intervalMs]);

  return (
    <div
      className="ui slider-section"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="slider-viewport">
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
      </div>
      <div className="slider-controls">
        <button
          className="slider-btn slider__btn-prev"
          onClick={(e) => {
            e.preventDefault();
            slidePrev();
          }}
          aria-label="Previous slide"
        >
          &#8249;
        </button>
        <button
          className="slider-btn slider__btn-next"
          onClick={(e) => {
            e.preventDefault();
            slideNext();
          }}
          aria-label="Next slide"
        >
          &#x203A;
        </button>
      </div>
      <div className="slider__dots">
        {slides.map((_, index) => (
          <button
            key={index}
            className={`slider__dot${index === activeIndex ? " active" : ""}`}
            onClick={() => setActiveIndex(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

CustomCarousel.propTypes = {
  children: PropTypes.node.isRequired,
  intervalMs: PropTypes.number,
};

export default CustomCarousel;
