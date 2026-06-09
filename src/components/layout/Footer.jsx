const Footer = () => (
  <footer className="footer">
    <div className="footer-inner">
      <span>
        OWL —{" "}
        <span style={{ fontFamily: "Caveat, cursive", fontSize: "1.1em" }}>
          Productivity System
        </span>
      </span>
      <div className="footer-links">
        <a href="/privacy">Privacy</a>
        <a href="/terms">Terms</a>
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
