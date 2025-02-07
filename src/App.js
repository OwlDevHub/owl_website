import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import Features from './components/Features';
import DownloadSection from './components/DownloadSection';
import Contacts from './components/Contacts';
import Footer from './components/Footer';
import './styles/index.css';
import './styles/owl_animation.css';

const App = () => {
  return (
    <Router>
      <div className="App">
        <Header />
        <main>
              <>
                <HeroSection />
                <Features />
                <div className='spacer'></div>
                <DownloadSection />
                <div className='spacer'></div>
                <Contacts />
                <div className='spacer'></div>
              </>
        </main>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
