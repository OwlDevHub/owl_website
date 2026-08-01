import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUpRightFromSquare } from "@fortawesome/free-solid-svg-icons";
import { OwlIcon } from "../ui";

const Footer = () => (
  <footer className="footer">
    <div className="footer-inner">
      <div className="footer-top">
        <div className="footer-brand">
          <a href="/" className="header-logo">
            <OwlIcon />
            OWL
          </a>
          <p>
            A keyboard-first productivity system for developers and IT teams
            who ship.
          </p>
        </div>

        <div className="footer-col">
          <h4>Product</h4>
          <a href="#features">
            Features <span className="footer-arrow" aria-hidden="true"><FontAwesomeIcon icon={faArrowUpRightFromSquare} /></span>
          </a>
          <a href="#pricing">
            Pricing <span className="footer-arrow" aria-hidden="true"><FontAwesomeIcon icon={faArrowUpRightFromSquare} /></span>
          </a>
          <Link to="/download">
            Download <span className="footer-arrow" aria-hidden="true"><FontAwesomeIcon icon={faArrowUpRightFromSquare} /></span>
          </Link>
        </div>

        <div className="footer-col">
          <h4>Resources</h4>
          <a href="#about">
            About <span className="footer-arrow" aria-hidden="true"><FontAwesomeIcon icon={faArrowUpRightFromSquare} /></span>
          </a>
          <a href="https://github.com/OwlDevHub" target="_blank" rel="noopener noreferrer">
            GitHub <span className="footer-arrow" aria-hidden="true"><FontAwesomeIcon icon={faArrowUpRightFromSquare} /></span>
          </a>
        </div>

        <div className="footer-col">
          <h4>Company</h4>
          <a href="https://nighty3098.vercel.app/" target="_blank" rel="noopener noreferrer">
            Portfolio <span className="footer-arrow" aria-hidden="true"><FontAwesomeIcon icon={faArrowUpRightFromSquare} /></span>
          </a>
          <a href="https://t.me/Night3098" target="_blank" rel="noopener noreferrer">
            Contact <span className="footer-arrow" aria-hidden="true"><FontAwesomeIcon icon={faArrowUpRightFromSquare} /></span>
          </a>
        </div>

        <div className="footer-col">
          <h4>Legal</h4>
          <Link to="/terms">
            Terms <span className="footer-arrow" aria-hidden="true"><FontAwesomeIcon icon={faArrowUpRightFromSquare} /></span>
          </Link>
          <Link to="/privacy">
            Privacy <span className="footer-arrow" aria-hidden="true"><FontAwesomeIcon icon={faArrowUpRightFromSquare} /></span>
          </Link>
        </div>
      </div>

      <div className="footer-bottom">
        <span className="footer-copy">&copy; 2026-2027 Nighty3098</span>
        <div className="footer-links">
          <a
            href="https://t.me/Night3098"
            target="_blank"
            rel="noopener noreferrer"
          >
            Telegram
          </a>
          <a
            href="https://discord.gg/#9707"
            target="_blank"
            rel="noopener noreferrer"
          >
            Discord
          </a>
          <a
            href="https://www.reddit.com/user/DEVELOPER0x31/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Reddit
          </a>
        </div>
      </div>
    </div>
  </footer>
);
export default Footer;
