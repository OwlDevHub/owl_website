import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPenRuler,
  faRotate,
  faDollarSign,
  faUsers,
  faTerminal,
} from "@fortawesome/free-solid-svg-icons";
import { faApple } from "@fortawesome/free-brands-svg-icons";
import PropTypes from "prop-types";

const defaultFeatures = [
  {
    icon: faPenRuler,
    text: "Minimalistic design",
    desc: "Clean and intuitive interface",
  },
  {
    icon: faRotate,
    text: "Fast sync",
    desc: "Real-time updates across devices",
  },
  {
    icon: faTerminal,
    text: "CLI mode",
    desc: "Powerful command-line interface",
  },
  {
    icon: faUsers,
    text: "Collaborative work",
    desc: "Work together seamlessly",
  },
  { icon: faDollarSign, text: "Free trial", desc: "Try before you commit" },
  { icon: faApple, text: "Cross platform", desc: "Works everywhere you do" },
];

const FeaturesSection = ({ title = "FEATURES", items = defaultFeatures }) => {
  return (
    <div className="features">
      <h2>{title}</h2>
      <div className="feature-grid">
        {items.map((feature, idx) => (
          <div key={idx} className="feature-card">
            <div className="icon">
              <FontAwesomeIcon icon={feature.icon} />
            </div>
            <h3>{feature.text}</h3>
            <p>{feature.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

FeaturesSection.propTypes = {
  title: PropTypes.string,
  items: PropTypes.arrayOf(
    PropTypes.shape({
      icon: PropTypes.object.isRequired,
      text: PropTypes.string.isRequired,
      desc: PropTypes.string,
    }),
  ),
};

export default FeaturesSection;
