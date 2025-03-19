import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import { HeroSection } from "./components/HeroSection";
import { Features, Images } from "./components/Features";
import DownloadSection from "./components/DownloadSection";
import Contacts from "./components/Contacts";
import Footer from "./components/Footer";
import "./styles/index.css";
import { DevelopmentProgressPage } from "./components/DevelopmentProgressPage";
import DownloadPage from "./components/DownloadPage";

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
        <Routes>
          <Route path="/download" element={<DownloadPage />} />
          <Route
            path="/"
            element={
              <main>
                <>
                  <HeroSection />
                  <div className="spacer"></div>
                  <Images />
                  <div
                    className="spacer"
                    style={{
                      maxHeight: "20px",
                      minHeight: "20px",
                      height: "20px",
                    }}
                  ></div>
                  <Features />
                  <div
                    className="spacer"
                    style={{
                      maxHeight: "20px",
                      minHeight: "20px",
                      height: "20px",
                    }}
                  ></div>
                  <DownloadSection />
                  <div className="spacer"></div>
                  <DevelopmentProgressPage />
                  <div className="spacer"></div>
                  <Contacts />
                  <div className="spacer"></div>
                </>
              </main>
            }
          />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
