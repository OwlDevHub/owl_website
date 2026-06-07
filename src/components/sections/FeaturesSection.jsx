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
import { Reveal, RevealStagger, RevealItem } from "../ui/Reveal";

const defaultFeatures = [
  {
    icon: faPenRuler,
    text: "Minimalistic design",
    desc: "Clean and intuitive interface that gets out of your way. No clutter, just focus.",
  },
  {
    icon: faRotate,
    text: "Fast sync",
    desc: "Real-time updates across all your devices. Changes propagate in milliseconds.",
  },
  {
    icon: faTerminal,
    text: "CLI mode",
    desc: "Powerful command-line interface for advanced users who live in the terminal.",
  },
  {
    icon: faUsers,
    text: "Collaborative work",
    desc: "Work together seamlessly with real-time collaboration and shared workspaces.",
  },
  {
    icon: faDollarSign,
    text: "Free trial",
    desc: "Try before you commit. Full access, no credit card required.",
  },
  {
    icon: faApple,
    text: "Cross platform",
    desc: "Works everywhere you do — macOS, Windows, Linux, and mobile.",
  },
];

const FeaturesSection = ({ title = "Features", items = defaultFeatures }) => {
  return (
    <div className="section" id="features">
      <div className="section-inner">
        <Reveal>
          <div className="section-header">
            <span className="section-label">Why OWL</span>
            <p className="section-desc">
              Everything you need to stay productive, nothing you don't.
            </p>
          </div>
        </Reveal>
        <RevealStagger className="feature-grid" staggerDelay={0.06}>
          {items.map((feature, idx) => (
            <RevealItem key={idx} className="feature-card" variant="fadeUp">
              <div className="feature-icon">
                <FontAwesomeIcon icon={feature.icon} />
              </div>
              <h3>{feature.text}</h3>
              <p>{feature.desc}</p>
            </RevealItem>
          ))}
        </RevealStagger>
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
