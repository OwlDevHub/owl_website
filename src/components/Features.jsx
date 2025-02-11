import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPenRuler,
  faRotate,
  faComment,
  faScrewdriverWrench,
  faDollarSign,
} from "@fortawesome/free-solid-svg-icons";
import { faApple } from "@fortawesome/free-brands-svg-icons";

const features = [
  { icon: faPenRuler, text: "Custom\ndesign" },
  { icon: faRotate, text: "Convenient\nsynchronization" },
  { icon: faComment, text: "Instant\nnotifications" },
  { icon: faScrewdriverWrench, text: "Customizing\nthe UI" },
  { icon: faDollarSign, text: "Free\ntrial version" },
  { icon: faApple, text: "Cross\nplatform" },
];

export const Features = () => (
  <div className="content">
    <div className="widget_blocks">
      {features.map((feature, index) => (
        <div key={index} className="square_block">
          <span className="emoji">
            <FontAwesomeIcon icon={feature.icon} />
          </span>
          <h1>
            {feature.text.split("\n").map((line, i) => (
              <React.Fragment key={i}>
                {line}
                <br />
              </React.Fragment>
            ))}
          </h1>
        </div>
      ))}
    </div>
  </div>
);

export const Images = () => (
  <div className="content">
    <img className="ui" src="imgs/app_1.png" alt="App interface" />
    <img className="ui" src="imgs/app_2.png" alt="App interface" />
  </div>
);
