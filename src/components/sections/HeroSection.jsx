import { OwlIcon } from "../ui";

const HeroSection = () => {
  return (
    <div className="hero">
      <div className="hero-info">
        <OwlIcon />
        <div>
          <h1>Meet Your New Personal Productivity App</h1>
          <ul className="hero-tags">
            <li>Early Access</li>
            <li>Free Trial</li>
          </ul>
        </div>
      </div>
      <p className="hero-notice">
        The service is currently under development. You can submit a request and
        receive a notification when we launch it.
      </p>
    </div>
  );
};

export default HeroSection;
