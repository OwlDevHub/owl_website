import React from 'react';
import OwlIcon from './OwlIcon';

export const HeroSection = () => {
  return (
      <div className="main_block animate__animated animate__bounceInDown" id="about_app">
        <OwlIcon />
        <h1>Modern task and project manager<br />for your productivity</h1>
      </div>
  );
};

export const SloganSection = ()  => {
  return (
    <div className="main_block" style={{ textAlign: "left", height: "100%", width: "100%"}}>
      <h1 className='big_text'><p style={{ padding: "0px", margin: "0px", fontSize: "xxx-large", fontWeight: "1000"}}>OWL:</p>Your ideas<br />your organization<br />your freedom</h1>
    </div>
  )
}

