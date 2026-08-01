import { Link } from "react-router-dom";
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
            Features
          </a>
          <a href="#pricing">
            Pricing
          </a>
          <Link to="/download">
            Download
          </Link>
        </div>

        <div className="footer-col">
          <h4>Resources</h4>
          <a href="#about">
            About
          </a>
          <a href="https://github.com/OwlDevHub" target="_blank" rel="noopener noreferrer">
            GitHub
          </a>
        </div>

        <div className="footer-col">
          <h4>Company</h4>
          <a href="https://nighty3098.vercel.app/" target="_blank" rel="noopener noreferrer">
            Portfolio
          </a>
          <a href="https://t.me/Night3098" target="_blank" rel="noopener noreferrer">
            Contact
          </a>
        </div>

        <div className="footer-col">
          <h4>Legal</h4>
          <Link to="/terms">
            Terms
          </Link>
          <Link to="/privacy">
            Privacy
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
