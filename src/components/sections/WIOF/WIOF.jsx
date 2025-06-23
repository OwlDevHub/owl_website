import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCode,
  faRocket,
  faUser,
  faGraduationCap,
} from "@fortawesome/free-solid-svg-icons";
import { MOTION, MOTION_LIST } from "../../../styles/motionConfig";

const cards = [
  {
    icon: faCode,
    title: "Developers",
    text: "automation of routine, flexible analytics",
  },
  {
    icon: faRocket,
    title: "Businesses",
    text: "control over projects, deadlines, and resources",
  },
  {
    icon: faUser,
    title: "Freelancers",
    text: "personal efficiency, easy task and project tracking",
  },
];

const WIOF = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <motion.div
      className="content enhanced-content"
      ref={ref}
      initial={{ opacity: 0, y: -100 }}
      animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : -100 }}
      transition={MOTION}
    >
      <div className="grid_1">
        {cards.map((card, idx) => (
          <motion.div
            className="card"
            key={card.title}
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: isInView ? 0 : 100, opacity: isInView ? 1 : 0 }}
            transition={MOTION_LIST(idx, 0.7)}
          >
            <div className="card-title">
              <FontAwesomeIcon
                icon={card.icon}
                className="list-icon"
                style={{ fontSize: "xxx-large" }}
              />{" "}
              {card.title}
            </div>
            {card.text}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default WIOF;
