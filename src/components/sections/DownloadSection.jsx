import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRocket } from "@fortawesome/free-solid-svg-icons";
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
              Be the first to try OWL. Drop your email and we'll let you know
              when it's ready.
            </p>
          </div>
        </Reveal>
        <Reveal variant="scaleIn">
          <div className="download-card">
            <h2>Join the waitlist</h2>
            <p>
              Early adopters get exclusive access and a special launch discount.
            </p>
            <form onSubmit={handleSubmit} className="download-form">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="download-input"
              />
              <button
                type="submit"
                className="download-button"
                disabled={status === "sending"}
              >
                Notify me
              </button>
            </form>
            {status === "sending" && (
              <p className="status-wait">Sending a request. Please wait</p>
            )}
            {status === "success" && (
              <p className="status-success">
                Thanks! You have been added to the waiting list.
              </p>
            )}
            {status === "error" && (
              <p className="status-error">
                Error when sending. Try again later.
              </p>
            )}
          </div>
        </Reveal>
      </div>
    </div>
  );
};

export default DownloadSection;
