import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faCloudArrowDown } from '@fortawesome/free-solid-svg-icons';

const DownloadSection = () => (
  <div className="download_app" id="download_app">
    <h1>Modern task and project manager for your productivity</h1>
    <div className="download-buttons">
      <a href="#" className="purchase_button">
        <h3><FontAwesomeIcon icon={faHeart} /> PURCHASE</h3>
        <h3 className="button_subblock">29.99$</h3>
      </a>
      <a href="https://github.com/Nighty3098/OWL_APP/releases" className="download_button">
        <h3><FontAwesomeIcon icon={faCloudArrowDown} /> DOWNLOAD</h3>
        <h3 className="button_subblock">TRIAL</h3>
      </a>
    </div>
  </div>
);

export default DownloadSection;
