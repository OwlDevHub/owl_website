import { Reveal, RevealStagger, RevealItem } from "../ui/Reveal";
import ImagesSection from "./ImagesSection";

const Content = () => {
  return (
    <div className="section" id="about">
      <div className="section-inner">
        <Reveal>
          <div className="section-header">
            <span className="section-label">About OWL</span>
            <p className="section-desc">
              We believe productivity tools should be fast, beautiful, and
              frictionless. OWL brings all your work together.
            </p>
          </div>
        </Reveal>

        <RevealStagger className="about-grid" staggerDelay={0.15}>
          <RevealItem className="about-visual">
            <ImagesSection />
          </RevealItem>
          <RevealItem className="about-text">
            <p>
              OWL is a powerful and intuitive platform for managing projects,
              tasks, and teams, created specifically for developers and IT teams
              who demand efficiency without the bloat.
            </p>
            <p>
              With real-time sync, CLI integration, and a clean minimal
              interface, OWL helps you focus on what matters — building great
              products.
            </p>
          </RevealItem>
        </RevealStagger>
      </div>
    </div>
  );
};

export default Content;
