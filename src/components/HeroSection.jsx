import React from 'react';
import { useNavigate } from 'react-router-dom';
import OwlIcon from './OwlIcon';

const HeroSection = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/development-progress');
  };

  return (
    <div className="main_block animate__animated animate__bounceInDown" id="about_app">
      <OwlIcon />
      <h1>OWL - YOUR PRODUCTIVITY APP</h1>
    </div>
  );
};

export default HeroSection;
