import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTelegram,
  faDiscord,
  faReddit,
  faSignalMessenger,
} from "@fortawesome/free-brands-svg-icons";
import { Reveal } from "../ui/Reveal";

const socials = [
  { icon: faTelegram, link: "https://t.me/Night3098", label: "Telegram" },
  { icon: faDiscord, link: "https://discord.gg/#9707", label: "Discord" },
  {
    icon: faReddit,
    link: "https://www.reddit.com/user/DEVELOPER0x31/",
    label: "Reddit",
  },
  {
    icon: faSignalMessenger,
    link: "https://signal.me/#eu/XJMqmO9JXZQCwYJIpzjOS741ZnGsLYOQhGqMfpS4lB-8PTSQVmRAbqFIvOrepYiK",
    label: "Signal",
  },
];

const Contacts = () => {
  return (
    <div className="section contacts-section" style={{ paddingTop: 0 }}>
      <div className="section-inner">
        <Reveal>
          <div className="contacts">
            <div className="contacts_badge_block">
              {socials.map((social) => (
                <a
                  key={social.label}
                  href={social.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="contact_button"
                  aria-label={social.label}
                >
                  <FontAwesomeIcon icon={social.icon} className="social-icon" />
                </a>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </div>
  );
};

export default Contacts;
