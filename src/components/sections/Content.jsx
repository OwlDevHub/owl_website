import { Reveal, RevealStagger, RevealItem } from "../ui/Reveal";
import ImagesSection from "./ImagesSection";

const Content = () => {
  return (
    <div className="section" id="about">
      <div className="section-inner">
        <Reveal>
          <div className="section-header">
            <span className="section-label">
              <hw>About</hw>
            </span>
            <p className="section-desc">
              Most productivity tools add more noise. OWL removes it - so you
              can focus on what actually matters: shipping.
            </p>
          </div>
        </Reveal>

        <RevealStagger className="about-text" staggerDelay={0.15}>
          <RevealItem>
            <p>
              OWL is a keyboard-first workspace that unifies project management,
              task tracking, and team collaboration into one fast, native
              experience. No web app lag. No context switching. No feature
              bloat.
            </p>
          </RevealItem>

          <RevealItem>
            <Reveal>
              <div className="about-visual">
                <ImagesSection />
              </div>
            </Reveal>
          </RevealItem>
        </RevealStagger>

        <Reveal>
          <div className="about-stats">
            <div className="about-stat">
              <span className="about-stat-value">CLI</span>
              <span className="about-stat-label">Native terminal integration</span>
            </div>
            <div className="about-stat-divider" />
            <div className="about-stat">
              <span className="about-stat-value">100%</span>
              <span className="about-stat-label">Keyboard-driven workflow</span>
            </div>
            <div className="about-stat-divider" />
            <div className="about-stat">
              <span className="about-stat-value">0</span>
              <span className="about-stat-label">Distractions. Just focus.</span>
            </div>
          </div>
        </Reveal>
      </div>
    </div>
  );
};

export default Content;
