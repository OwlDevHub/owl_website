import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { Reveal } from "../ui/Reveal";
import { AppDemo } from "../../owl-demo/components";
import "../../owl-demo/styles.css";

const Content = () => {
  return (
    <div className="section" id="about">
      <div className="section-inner">
        <Reveal>
          <div className="card card--large feature-split">
            <div className="feature-split__text">
              <span className="section-label">About OWL</span>
              <h3>
                OWL is an applied research team building the future of project
                management.
              </h3>
              <p>
                Most productivity tools add more noise. OWL removes it - a{" "}
                <strong>keyboard-first workspace</strong> that unifies project
                management, task tracking, and team collaboration into one fast,
                native experience. No web app lag. No context switching. No
                feature bloat.
              </p>
              <a className="feature-split__link" href="#download_app">
                Join the early access{" "}
                <span aria-hidden="true"><FontAwesomeIcon icon={faArrowRight} /></span>
              </a>
            </div>
            <div className="feature-split__media">
              <AppDemo defaultTab="stats" />
            </div>
          </div>
        </Reveal>
      </div>
    </div>
  );
};

export default Content;
