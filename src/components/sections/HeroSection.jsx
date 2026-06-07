import { OwlIcon } from "../ui";

const HeroSection = () => {
  return (
    <div className="hero">
      <div className="hero-content">
        <div className="hero-text">
          <div className="hero-badge">
            <span>✦</span>
            Early Access — Free Trial
          </div>

          <h1>
            Meet Your New <span>Productivity</span> OS
          </h1>

          <p className="hero-sub">
            OWL is a powerful platform for managing projects, tasks, and teams.
            Built for developers who value speed, simplicity, and clean design.
          </p>

          <div className="hero-cta-group">
            <a className="hero-cta-primary" href="#download_app">
              Get Early Access
            </a>
            <a className="hero-cta-secondary" href="#features">
              Explore Features
            </a>
          </div>
        </div>

        <div className="hero-visual">
          <div className="hero-icon-frame">
            <div className="hero-icon-glow" />
            <div className="hero-icon-inner">
              <OwlIcon />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
