import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

function CustomCarousel({ children }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [slideDone, setSlideDone] = useState(true);
  const [timeID, setTimeID] = useState(null);

  useEffect(() => {
    if (slideDone) {
      setSlideDone(false);
      setTimeID(
        setTimeout(() => {
          slideNext();
          setSlideDone(true);
        }, 5000),
      );
    }
  }, [slideDone]);

  const slideNext = () => {
    setActiveIndex((val) => {
      const count = React.Children.count(children);
      return val >= count - 1 ? 0 : val + 1;
    });
  };

  const slidePrev = () => {
    setActiveIndex((val) => {
      const count = React.Children.count(children);
      return val <= 0 ? count - 1 : val - 1;
    });
  };

  const AutoPlayStop = () => {
    if (timeID > 0) {
      clearTimeout(timeID);
      setSlideDone(false);
    }
  };

  const AutoPlayStart = () => {
    if (!slideDone) {
      setSlideDone(true);
    }
  };

  return (
    <div
      className="ui"
      onMouseEnter={AutoPlayStop}
      onMouseLeave={AutoPlayStart}
    >
      {React.Children.map(children, (item, index) => (
        <div
          className={"slider__item slider__item-active-" + (activeIndex + 1)}
          key={item.id} {...item}
        >
          {item}
        </div>
      ))}
      <button
        className="slider__btn-next"
        onClick={(e) => {
          e.preventDefault();
          slideNext();
        }}
      >
        {">"}
      </button>
      <button
        className="slider__btn-prev"
        onClick={(e) => {
          e.preventDefault();
          slidePrev();
        }}
      >
        {"<"}
      </button>
    </div>
  );
}

CustomCarousel.propTypes = {
  children: PropTypes.node.isRequired,
};

export default CustomCarousel;
