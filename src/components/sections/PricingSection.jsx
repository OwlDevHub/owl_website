import { useRef, useState, useCallback } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { Reveal, RevealStagger, RevealItem } from "../ui/Reveal";

const plans = [
  {
    name: "Free",
    price: "0",
    period: "/ 30 days",
    features: [
      "Basic project management",
      "Up to 3 projects",
      "Kanban boards",
      "Task management",
      "Community support",
    ],
    cta: "Get Started",
    featured: false,
  },
  {
    name: "Pro",
    price: "5.90",
    period: "/ 30 days",
    features: [
      "Everything in Free",
      "Unlimited projects",
      "Prioritized support",
      "CLI integration",
      "Real-time sync",
      "Advanced analytics",
    ],
    cta: "Try Pro",
    featured: true,
  },
  {
    name: "Premium",
    price: "8.90",
    period: "/ 30 days",
    features: [
      "Everything in Pro",
      "Exclusive features",
      "Personalized settings",
      "Early access to updates",
      "Priority onboarding",
      "Dedicated support",
    ],
    cta: "Go Premium",
    featured: false,
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
              Choose the plan that fits your workflow. Upgrade anytime.
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
                    <span className="pricing-currency">$</span>
                    <span className="pricing-value">{plan.price}</span>
                    <span className="pricing-period">{plan.period}</span>
                  </div>
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
