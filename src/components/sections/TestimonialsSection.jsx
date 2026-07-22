import { Reveal, RevealStagger, RevealItem } from "../ui/Reveal";
import testimonials from "../../data/testimonials";

const TestimonialsSection = () => {
  return (
    <div className="section" id="testimonials" hidden>
      <div className="section-inner">
        <Reveal>
          <div className="section-header">
            <span className="section-label">Testimonials</span>
            <p className="section-desc">
              What early users are saying about OWL.
            </p>
          </div>
        </Reveal>
        <RevealStagger className="testimonials-grid" staggerDelay={0.1}>
          {testimonials.map((t, i) => (
            <RevealItem key={i} variant="fadeUp">
              <div className="testimonial-card">
                <div className="testimonial-quote-mark">"</div>
                <p className="testimonial-quote">{t.quote}</p>
                <div className="testimonial-author">
                  <div className="testimonial-avatar">
                    {t.author.charAt(0)}
                  </div>
                  <div>
                    <div className="testimonial-name">{t.author}</div>
                    <div className="testimonial-role">{t.role}</div>
                  </div>
                </div>
              </div>
            </RevealItem>
          ))}
        </RevealStagger>
      </div>
    </div>
  );
};

export default TestimonialsSection;
