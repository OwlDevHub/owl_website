import { Link } from "react-router-dom";

const Footer = () => (
  <footer className="footer">
    <div className="footer-inner">
      <span>
        OWL -{" "}
        <span style={{ fontFamily: "Caveat, cursive", fontSize: "1.1em" }}>
          Productivity System
        </span>
      </span>
      <div className="footer-links">
        <Link to="/privacy">Privacy</Link>
        <Link to="/terms">Terms</Link>
        <a
          href="https://nighty3098.vercel.app/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Portfolio
        </a>
      </div>
      <span className="footer-copy">&copy; 2026-2027 Nighty3098</span>
    </div>
  </footer>
);
export default Footer;
