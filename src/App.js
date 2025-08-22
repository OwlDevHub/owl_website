import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Header, Footer } from "./components/layout";
import {
  HeroSection,
  FeaturesSection,
  ImagesSection,
  DownloadSection,
  Content,
} from "./components/sections";
import { PrivacyPage, TermsPage, DownloadPage } from "./components/pages";
import "./styles/index.css";
import { motion } from "framer-motion";

const App = () => {
  return (
    <Router>
      <motion.div
        className="App"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Routes>
          <Route path="/download" element={<DownloadPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route
            path="/"
            element={
              <main>
                <Header />
                <div className="flex flex-col flex-center w-auto h-auto text-center">
                  <HeroSection />
                  <div className="spacer"></div>
                  <Content />
                  <ImagesSection />
                  <div className="spacer"></div>
                  <FeaturesSection />
                  <div className="spacer"></div>
                  <DownloadSection />
                  <div className="spacer"></div>
                  <Footer />
                </div>
              </main>
            }
          />
        </Routes>
      </motion.div>
    </Router>
  );
};

export default App;
