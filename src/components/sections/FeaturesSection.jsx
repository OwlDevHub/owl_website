import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRight,
  faDesktop,
  faLaptop,
  faMobile,
  faTablet,
  faCloud,
  faArrowsRotate,
} from "@fortawesome/free-solid-svg-icons";
import { motion } from "framer-motion";
import { Reveal } from "../ui/Reveal";
import LazyDemo from "../ui/LazyDemo";

const DemoBadge = () => (
  <span className="demo-badge">Click to explore</span>
);

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

const syncCenter = { x: 150, y: 150 };

const syncDevices = [
  { icon: faDesktop, label: "Desktop", x: 55, y: 55, p: { top: "18.3%", left: "18.3%" } },
  { icon: faLaptop, label: "Laptop", x: 245, y: 55, p: { top: "18.3%", left: "81.7%" } },
  { icon: faMobile, label: "Phone", x: 55, y: 245, p: { top: "81.7%", left: "18.3%" } },
  { icon: faTablet, label: "Tablet", x: 245, y: 245, p: { top: "81.7%", left: "81.7%" } },
];

const SyncStage = () => (
  <div className="product-window sync-window">
    <div className="product-window__bar">
      <span className="product-window__dot" />
      <span className="product-window__dot" />
      <span className="product-window__dot" />
      <span className="product-window__title">owl - sync status</span>
    </div>
    <div className="sync-stage">
      <svg
        className="sync-stage__lines"
        viewBox="0 0 300 300"
        preserveAspectRatio="xMidYMid meet"
      >
        {syncDevices.map((d, i) => (
          <motion.line
            key={i}
            x1={syncCenter.x}
            y1={syncCenter.y}
            x2={d.x}
            y2={d.y}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 + i * 0.12, duration: 0.3 }}
          />
        ))}
      </svg>

      <div className="sync-stage__hub">
        <div className="sync-stage__hub-icon">
          <motion.div
            className="sync-stage__ripple"
            animate={{ scale: [1, 2.1, 2.1], opacity: [0.5, 0, 0] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: "easeOut" }}
          />
          <motion.div
            className="sync-stage__ripple"
            animate={{ scale: [1, 2.1, 2.1], opacity: [0.5, 0, 0] }}
            transition={{
              duration: 2.2,
              repeat: Infinity,
              ease: "easeOut",
              delay: 1.1,
            }}
          />
          <FontAwesomeIcon icon={faCloud} />
        </div>
        <span className="sync-stage__hub-label">OWL Cloud</span>
      </div>

      {syncDevices.map((d, i) => (
        <motion.div
          key={i}
          className="sync-node"
          style={{ left: d.p.left, top: d.p.top }}
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 + (i + 1) * 0.12, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="sync-node__icon">
            <FontAwesomeIcon icon={d.icon} />
          </div>
          <span className="sync-node__label">{d.label}</span>
        </motion.div>
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
        <LazyDemo defaultTab="tasks" />
        <DemoBadge />
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
        <LazyDemo defaultTab="projects" />
        <DemoBadge />
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
    title: "Real-time sync, everywhere",
    desc: "Every change propagates instantly across all your devices and team members. CRDT-based sync resolves concurrent edits automatically - no conflicts, no merges, no stale state.",
    link: { href: "#download_app", label: "Join the beta" },
    media: <SyncStage />,
    reverse: false,
  },
  {
    title: "In every tool, at every step",
    desc: "Full terminal integration for advanced workflows. Script and pipe it - without leaving your shell.",
    link: { href: "#download_app", label: "Join the beta" },
    media: (
      <CliWindow
        lines={[
          { cmd: "owl_cli init NewProject" },
          { text: "✓ Project created" },
          { cmd: 'owl_cli task add "Ship OWL 1.4" --priority high' },
          { text: " > sprint-14" },
          { text: "   NewProject" },
          { text: "   TechSupport" },
          { text: "✓ Task added to sprint-14" },
          { cmd: "owl status" },
          { text: "✓ 2 in progress, 1 blocked" },
        ]}
      />
    ),
    reverse: true,
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
