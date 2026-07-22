import { useRef, useState, useCallback } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { Reveal, RevealStagger, RevealItem } from "../ui/Reveal";

const plans = [
  {
    name: "Free",
    price: 0,
    duration_days: 30,
    about: "Core features for solo developers exploring OWL",
    cta: "Start Free",
    featured: false,
    features: [
      "Up to 3 projects",
      "Task & project management",
      "CLI mode",
      "Community support",
    ],
  },
  {
    name: "Pro",
    price: 5.9,
    duration_days: 30,
    about: "For professionals who need more power and flexibility",
    cta: "Try Pro Free for 14 Days",
    featured: true,
    features: [
      "Unlimited projects",
      "Real-time collaboration",
      "Priority support",
      "Advanced automation",
      "Cross-device sync",
    ],
  },
  {
    name: "Premium",
    price: 8.9,
    duration_days: 30,
    about: "Full access for teams and power users",
    cta: "Go Premium",
    featured: false,
    features: [
      "Everything in Pro",
      "Admin controls & roles",
      "Custom integrations",
      "Dedicated onboarding",
      "SLA guarantee",
    ],
  },
];

const PricingSection = () => {
  const [activeDot, setActiveDot] = useState(0);
  const wrapRef = useRef(null);

  const onScroll = useCallback(() => {
    const el = wrapRef.current;
    if (!el) return;
    const idx = Math.round(el.scrollLeft / el.clientWidth);
    setActiveDot(Math.min(idx, plans.length - 1));
  }, []);

  return (
    <div className="section" id="pricing">
      <div className="section-inner">
        <Reveal>
          <div className="section-header">
            <span className="section-label">Pricing</span>
            <p className="section-desc">
              Start free. Upgrade when you need more. No hidden fees.
            </p>
          </div>
        </Reveal>
        <div ref={wrapRef} className="pricing-scroll-wrap" onScroll={onScroll}>
          <RevealStagger className="pricing-grid" staggerDelay={0.08}>
            {plans.map((plan) => (
              <RevealItem key={plan.name} variant="fadeUp">
                <div
                  className={`pricing-card${plan.featured ? " featured" : ""}`}
                >
                  {plan.featured && (
                    <span className="pricing-badge">Most Popular</span>
                  )}
                  <h3>{plan.name}</h3>
                  <div className="pricing-amount">
                    {plan.price > 0 && (
                      <span className="pricing-currency">$</span>
                    )}
                    <span className="pricing-value">
                      {plan.price > 0 ? plan.price : "Free"}
                    </span>
                    {plan.price > 0 && (
                      <span className="pricing-period">
                        / {plan.duration_days} days
                      </span>
                    )}
                  </div>
                  <p className="pricing-desc">{plan.about}</p>
                  <ul className="pricing-features">
                    {plan.features.map((f) => (
                      <li key={f}>
                        <FontAwesomeIcon icon={faCheck} />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <a
                    href="#download_app"
                    className={
                      plan.featured ? "hero-cta-main" : "hero-cta-secondary"
                    }
                  >
                    {plan.cta}
                  </a>
                </div>
              </RevealItem>
            ))}
          </RevealStagger>
        </div>
        <div className="pricing-dots">
          {plans.map((_, i) => (
            <span
              key={i}
              className={`pricing-dot${i === activeDot ? " active" : ""}`}
              onClick={() => {
                const el = wrapRef.current;
                if (el) {
                  el.scrollTo({
                    left: i * el.clientWidth,
                    behavior: "smooth",
                  });
                }
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default PricingSection;
