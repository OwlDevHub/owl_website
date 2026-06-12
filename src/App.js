import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Header, Footer } from "./components/layout";
import CustomCursor from "./components/ui/CustomCursor";
import {
  HeroSection,
  FeaturesSection,
  DownloadSection,
  PricingSection,
  Content,
  Contacts,
} from "./components/sections";
import { PrivacyPage, TermsPage, DownloadPage } from "./components/pages";
import SmoothScroll from "./components/SmoothScroll";
import "./styles/index.css";
import ThemeInitializer from "./components/ThemeInitializer";

const App = () => {
  return (
    <Router>
      <ThemeInitializer />
      <div className="noise-overlay" />
      <CustomCursor />
      <SmoothScroll>
        <Routes>
          <Route path="/download" element={<DownloadPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route
            path="/"
            element={
              <main>
                <Header />
                <HeroSection />
                <Content />
                <FeaturesSection />
                <PricingSection />
                <DownloadSection />
                <Contacts />
                <Footer />
              </main>
            }
          />
        </Routes>
      </SmoothScroll>
    </Router>
  );
};

export default App;
