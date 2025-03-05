import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import { SloganSection } from "./components/SloganSection.jsx";
import { HeroSection } from "./components/HeroSection";
import { Features, Images } from "./components/Features";
import DownloadSection from "./components/DownloadSection";
import Contacts from "./components/Contacts";
import Footer from "./components/Footer";
import "./styles/index.css";
import { DevelopmentProgressPage } from "./components/DevelopmentProgressPage";

const App = () => {
  return (
    <Router>
      <div
        className="App"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Header />
        <main>
          <>
            <HeroSection />
            <div className="spacer"></div>
            <Images />
            <Features />
            <div className="spacer"></div>
            <SloganSection />
            <DownloadSection />
            <div className="spacer"></div>
            <DevelopmentProgressPage />
            <div className="spacer"></div>
            <Contacts />
            <div className="spacer"></div>
          </>
        </main>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
