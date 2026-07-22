import React, { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { Reveal } from "../ui/Reveal";
import {
  fetchIpAddress,
  getUserTimezone,
  getScreenInfo,
  getBrowserInfo,
  getDeviceData,
  getNetworkInfo,
  getPerformanceInfo,
  sendToTelegram,
} from "../../api/sendRequestToTG";

const DownloadSection = () => {
  const [email, setEmail] = useState("");
  const [ipAddr, setIpAddr] = useState("");
  const [timezone, setTimezone] = useState("");
  const [status, setStatus] = useState(null);
  const inputRef = useRef(null);

  const [deviceData, setDeviceData] = useState({});
  const [screenInfo, setScreenInfo] = useState({});
  const [browserInfo, setBrowserInfo] = useState({});
  const [networkInfo, setNetworkInfo] = useState({});
  const [performanceInfo, setPerformanceInfo] = useState({});

  useEffect(() => {
    const collect = async () => {
      try {
        setIpAddr(await fetchIpAddress());
      } catch (err) {
        console.log(err);
      }
      setTimezone(getUserTimezone());
      setScreenInfo(getScreenInfo());
      setBrowserInfo(getBrowserInfo());
      setDeviceData(getDeviceData());
      setNetworkInfo(getNetworkInfo());
      setPerformanceInfo(getPerformanceInfo());
    };
    collect();
  }, []);

  useEffect(() => {
    if (status === "sending" && inputRef.current) {
      inputRef.current.focus();
    }
  }, [status]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus("sending");

    const requestData = {
      email,
      ipAddress: ipAddr,
      timezone: timezone,
      deviceInfo: {
        userAgent: browserInfo.userAgent,
        platform: browserInfo.platform,
        language: browserInfo.language,
        deviceType: deviceData.deviceType,
        os: deviceData.os,
        osVersion: deviceData.osVersion,
        browserName: deviceData.browserName,
        browserVersion: deviceData.browserVersion,
        screen: screenInfo,
        browser: browserInfo,
        network: networkInfo,
        performance: performanceInfo,
        localDateTime: new Date().toISOString(),
        localTime: new Date().toLocaleTimeString(),
        localDate: new Date().toLocaleDateString(),
      },
    };

    try {
      await sendToTelegram(requestData);

      if (process.env.NODE_ENV === "development") {
        console.log("Request sent successfully");
      }

      setStatus("success");
      setEmail("");
    } catch (error) {
      setStatus("error");
      if (process.env.NODE_ENV === "development") {
        console.error("Submission error:", error);
      }
    }
  };

  return (
    <div className="section" id="download_app">
      <div className="section-inner">
        <Reveal>
          <div className="section-header">
            <span className="section-label">Early Access</span>
            <p className="section-desc">
              Be the first to try OWL. Early adopters get 20% off first year.
            </p>
          </div>
        </Reveal>

        <div className="download-grid">
          <Reveal variant="scaleIn">
            <div className="download-card">
              <div className="download-card-header">
                <h2>Get Early Access</h2>
              </div>
              <p>
                Drop your email and we'll notify you the moment OWL launches.
                No spam, no noise - just one email.
              </p>
              <form onSubmit={handleSubmit} className="download-form">
                <div className="download-input-group">
                  <input
                    ref={inputRef}
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@company.com"
                    className="download-input"
                  />
                </div>
                <button
                  type="submit"
                  className="download-button"
                  disabled={status === "sending"}
                >
                  {status === "sending"
                    ? "Sending..."
                    : "Claim my early access"}
                </button>
              </form>
              {status === "sending" && (
                <motion.p
                  className="status-wait"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <span className="status-loading-dot" />
                  Securing your spot...
                </motion.p>
              )}
              {status === "success" && (
                <motion.p
                  className="status-success"
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  ✓ You're on the list. We'll notify you at launch.
                </motion.p>
              )}
              {status === "error" && (
                <motion.p
                  className="status-error"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  Something went wrong. Try again or reach out on Telegram.
                </motion.p>
              )}

            </div>
          </Reveal>

          <Reveal variant="fadeUp">
            <div className="download-benefits">
              <h3>Early adopters get:</h3>
              <ul className="download-benefits-list">
                <li>
                  <span className="download-benefit-check">→</span>
                  20% off first year
                </li>
                <li>
                  <span className="download-benefit-check">→</span>
                  Priority feature requests
                </li>
                <li>
                  <span className="download-benefit-check">→</span>
                  Direct line to the founder
                </li>

              </ul>
            </div>
          </Reveal>
        </div>
      </div>
    </div>
  );
};

export default DownloadSection;
