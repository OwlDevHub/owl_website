import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Header, Footer } from "./components/layout";
import {
  HeroSection,
  FeaturesSection,
  DownloadSection,
  Content,
} from "./components/sections";
import { PrivacyPage, TermsPage, DownloadPage } from "./components/pages";
import SmoothScroll from "./components/SmoothScroll";
import "./styles/index.css";

const App = () => {
  return (
    <Router>
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
                <DownloadSection />
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
