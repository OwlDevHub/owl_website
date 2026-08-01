import React, { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
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
    <div className="section download-section" id="download_app">
      <div className="section-inner">
        <Reveal>
          <div className="download-cta">
            <span className="section-label">Early access</span>
            <h2>Try OWL now.</h2>
            <p>
              Be the first to try OWL. Early adopters get 20% off the first
              year - drop your email and we'll notify you the moment OWL
              launches.
            </p>
            <form onSubmit={handleSubmit} className="download-form">
              <input
                ref={inputRef}
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                className="download-input"
                aria-label="Email address"
              />
              <button
                type="submit"
                className="download-button"
                disabled={status === "sending"}
              >
                {status === "sending" ? "Sending..." : "Get early access"}
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
                <FontAwesomeIcon icon={faCheck} /> You're on the list. We'll
                notify you at launch.
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
      </div>
    </div>
  );
};

export default DownloadSection;
