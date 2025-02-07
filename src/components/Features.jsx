import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRocket, faArrowsRotate, faBell, faScrewdriverWrench, faYenSign } from '@fortawesome/free-solid-svg-icons';
import { faApple } from '@fortawesome/free-brands-svg-icons';

const features = [
  { icon: faRocket, text: 'Custom\ndesign' },
  { icon: faArrowsRotate, text: 'Convenient\nsynchronization' },
  { icon: faBell, text: 'Instant\nnotifications' },
  { icon: faScrewdriverWrench, text: 'Customizing\nthe UI' },
  { icon: faYenSign, text: 'Free\ntrial version' },
  { icon: faApple, text: 'Cross\nplatform' },
];

const Features = () => (
  <div className="main_block">
    <img className="ui" src="imgs/app_dark.png" alt="App interface" />
    <div className='spacer'></div>
    <div className="widget_blocks">
      {features.map((feature, index) => (
        <div key={index} className="square_block">
          <span className="emoji">
            <FontAwesomeIcon icon={feature.icon} />
          </span>
          <h1>
            {feature.text.split('\n').map((line, i) => (
              <React.Fragment key={i}>{line}<br /></React.Fragment>
            ))}
          </h1>
        </div>
      ))}
    </div>
  </div>
);

export default Features;
