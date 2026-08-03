import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { Reveal } from "../ui/Reveal";
import { AppDemo } from "../../owl-demo/components";
import "../../owl-demo/styles.css";

const CliWindow = ({ lines }) => (
  <div className="product-window">
    <div className="product-window__bar">
      <span className="product-window__dot" />
      <span className="product-window__dot" />
      <span className="product-window__dot" />
      <span className="product-window__title">owl - terminal</span>
    </div>
    <div className="cli-window">
      {lines.map((line, i) => (
        <div className={`cli-line${line.ok ? " cli-ok" : ""}`} key={i}>
          {line.cmd ? (
            <>
              <span className="cli-prompt">$</span> {line.cmd}
            </>
          ) : (
            line.text
          )}
        </div>
      ))}
    </div>
  </div>
);

const features = [
  {
    title: "Plan, track, and ship in one workspace",
    desc: "OWL replaces the pile of tabs with a single, fast workspace. Boards, lists, timelines, and docs live side by side - and everything stays in sync the moment you type.",
    link: { href: "#download_app", label: "Join the beta" },
    media: (
      <div className="demo-product">
        <AppDemo defaultTab="tasks" />
        <div className="product-window demo-product__shot">
          <div className="product-window__body">
            <img src="/imgs/2.png" alt="OWL kanban board" />
          </div>
        </div>
      </div>
    ),
    reverse: false,
  },
  {
    title: "Made for teamwork",
    desc: "Share boards, assign work, and comment in real time. Presence indicators, mentions, and live updates keep everyone on the same page - without the meeting spam.",
    link: { href: "#download_app", label: "Join the beta" },
    media: (
      <div className="demo-product">
        <AppDemo defaultTab="projects" />
        <div className="product-window demo-product__shot">
          <div className="product-window__body">
            <img src="/imgs/7.png" alt="OWL team collaboration" />
          </div>
        </div>
      </div>
    ),
    reverse: true,
  },
  {
    title: "In every tool, at every step",
    desc: "Full terminal integration for advanced workflows. Script and pipe it - without leaving your shell.",
    link: { href: "#download_app", label: "Join the beta" },
    media: (
      <CliWindow
        lines={[
          { cmd: "owl init my-project" },
          { text: "✓ Project created (84ms)" },
          { cmd: 'owl task add "Ship OWL 1.4" --priority high' },
          { text: "✓ Task added to sprint-14" },
          { cmd: "owl status" },
          { text: "✓ 2 in progress, 1 blocked" },
        ]}
      />
    ),
    reverse: false,
  },
];

const FeaturesSection = () => {
  return (
    <div className="section" id="features">
      <div className="section-inner feature-stack">
        <Reveal>
          <div className="section-header">
            <span className="section-label">Features</span>
            <h2 className="handwrite_h2">
              Everything you need. Nothing you don't.
            </h2>
            <p className="section-desc">
              Every feature exists for one reason: to make you faster.
            </p>
          </div>
        </Reveal>

        {features.map((feature, idx) => (
          <Reveal key={idx}>
            <div
              className={`card card--large feature-split${feature.reverse ? " feature-split--reverse" : ""}`}
            >
              <div className="feature-split__text">
                <h3>{feature.title}</h3>
                <p>{feature.desc}</p>
                <a className="feature-split__link" href={feature.link.href}>
                  {feature.link.label}{" "}
                  <span aria-hidden="true"><FontAwesomeIcon icon={faArrowRight} /></span>
                </a>
              </div>
              <div className="feature-split__media">{feature.media}</div>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  );
};

export default FeaturesSection;
