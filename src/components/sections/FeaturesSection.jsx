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
    text: "Zero-clutter focus",
    desc: "Clean interface that stays out of your way. Every pixel has a purpose - no tabs, no toolbars, no noise.",
  },
  {
    icon: faRotate,
    text: "Real-time sync",
    desc: "Changes propagate across every device in milliseconds. Your workspace is always up to date.",
  },
  {
    icon: faTerminal,
    text: "Native CLI mode",
    desc: "Full terminal integration for advanced workflows. Script it, pipe it, automate it - without leaving your shell.",
  },
  {
    icon: faUsers,
    text: "Real-time collaboration",
    desc: "Co-edit tasks, share workspaces, and move faster together. Built for teams that ship.",
  },
  {
    icon: faDollarSign,
    text: "Free to start",
    desc: "Full-featured free tier. No time limit. No credit card required. Upgrade when you outgrow it.",
  },
  {
    icon: faApple,
    text: "Runs everywhere",
    desc: "Native on macOS, Windows, and Linux. One consistent experience across every machine you own.",
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
              Every feature exists for one reason: to make you faster.
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
