import React, { useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLightbulb, faScaleBalanced,
} from "@fortawesome/free-solid-svg-icons";
import {
  faTelegram,
  faDiscord,
  faReddit,
  faSignalMessenger,
} from "@fortawesome/free-brands-svg-icons";
import { motion, useInView } from "framer-motion";

const socials = [
  { icon: faTelegram, link: "https://t.me/Night3098" },
  { icon: faDiscord, link: "https://discord.gg/#9707" },
  { icon: faReddit, link: "https://www.reddit.com/user/DEVELOPER0x31/" },
  {
    icon: faSignalMessenger,
    link: "https://signal.me/#eu/XJMqmO9JXZQCwYJIpzjOS741ZnGsLYOQhGqMfpS4lB-8PTSQVmRAbqFIvOrepYiK",
  },
];

const Contacts = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <motion.div
      className="contacts"
      id="contacts"
      ref={ref}
      initial={{ opacity: 0, y: 100 }}
      animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 100 }}
      transition={{ duration: 0.8 }}
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isInView ? 1 : 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        style={{
          alignItems: "right",
          alignContent: "right",
          display: "flex",
          flexDirection: "flex-end",
        }}
      >
        <div className="contacts_badge_block">
          {socials.map((social, index) => (
            <motion.a
              key={index}
              href={social.link}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: isInView ? 1 : 0, x: isInView ? 0 : -50 }}
              transition={{ duration: 0.5 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <div className="contact_button">
                <FontAwesomeIcon icon={social.icon} className="social-icon" />
              </div>
            </motion.a>
          ))}
        </div>
      </motion.div>
      <div className="spacer"></div>
      <div style={{ width: "100%", display: "flex", flexDirection: "column", alignContent: "center", alignItems: "center", justifyContent: "center", gap: "10px"}}>
      <motion.a
        href="/terms"
        className="navbar_button"
        target="_blank"
        style={{ width: "100%", height: "40px" }}
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: isInView ? 0 : 100, opacity: isInView ? 1 : 0 }}
        transition={{ duration: 0.5 }}
      >
        <FontAwesomeIcon icon={faScaleBalanced} />
        Terms of Use
      </motion.a>
      <motion.a
        href="/privacy"
        className="navbar_button"
        target="_blank"
        style={{ width: "100%", height: "40px" }}
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: isInView ? 0 : 100, opacity: isInView ? 1 : 0 }}
        transition={{ duration: 0.5 }}
      >
        <FontAwesomeIcon icon={faLightbulb} /> PRIVACY
      </motion.a>
      </div>
    </motion.div>
  );
};

export default Contacts;
