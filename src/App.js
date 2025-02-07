import React, { useEffect } from 'react';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import Features from './components/Features';
import DownloadSection from './components/DownloadSection';
import Contacts from './components/Contacts';
import Footer from './components/Footer';
import './styles/index.css';
import './styles/owl_animation.css';

const App = () => {
  useEffect(() => {
    document.getElementById("year").textContent = new Date().getFullYear();
  }, []);

  return (
    <div className="App">
      <Header />
      <main>
        <HeroSection />
        <Features />
        <DownloadSection />
        <div className='spacer'></div>
        <Contacts />
        <div className='spacer'></div>
      </main>
      <Footer />
    </div>
  );
};

export default App;
