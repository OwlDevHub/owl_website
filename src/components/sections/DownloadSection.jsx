import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRocket } from "@fortawesome/free-solid-svg-icons";
import { Reveal } from "../ui/Reveal";

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
    const fetchIpAddress = async () => {
      try {
        const response = await fetch("https://api.ipify.org?format=json");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setIpAddr(data.ip);
      } catch (err) {
        console.log(err);
      }
    };

    const getUserTimezone = () => {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
      setTimezone(tz);
    };

    const collectDeviceInfo = () => {
      setScreenInfo({
        screenWidth: window.screen.width,
        screenHeight: window.screen.height,
        screenColorDepth: window.screen.colorDepth,
        screenPixelDepth: window.screen.pixelDepth,
        availableWidth: window.screen.availWidth,
        availableHeight: window.screen.availHeight,
        windowInnerWidth: window.innerWidth,
        windowInnerHeight: window.innerHeight,
        devicePixelRatio: window.devicePixelRatio,
        orientation: window.screen.orientation
          ? window.screen.orientation.type
          : "unknown",
      });

      const ua = navigator.userAgent;
      const platform = navigator.platform;

      setBrowserInfo({
        userAgent: ua,
        platform: platform,
        language: navigator.language,
        languages: navigator.languages,
        cookieEnabled: navigator.cookieEnabled,
        doNotTrack: navigator.doNotTrack,
        hardwareConcurrency: navigator.hardwareConcurrency || "unknown",
        deviceMemory: navigator.deviceMemory || "unknown",
        maxTouchPoints: navigator.maxTouchPoints,
        vendor: navigator.vendor,
        vendorSub: navigator.vendorSub,
        product: navigator.product,
        productSub: navigator.productSub,
        appName: navigator.appName,
        appVersion: navigator.appVersion,
        isChrome: ua.indexOf("Chrome") > -1,
        isFirefox: ua.indexOf("Firefox") > -1,
        isSafari: ua.indexOf("Safari") > -1 && ua.indexOf("Chrome") === -1,
        isEdge: ua.indexOf("Edg") > -1,
        isOpera: ua.indexOf("Opera") > -1 || ua.indexOf("OPR") > -1,
        isMobile:
          /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
            ua,
          ),
        isTablet: /iPad|Android(?!.*Mobile)/i.test(ua),
      });

      setDeviceData({
        deviceType: getDeviceType(),
        os: getOS(),
        osVersion: getOSVersion(),
        browserName: getBrowserName(),
        browserVersion: getBrowserVersion(),
      });
    };

    const collectNetworkInfo = () => {
      if ("connection" in navigator) {
        const conn = navigator.connection;
        setNetworkInfo({
          effectiveType: conn.effectiveType,
          downlink: conn.downlink,
          rtt: conn.rtt,
          saveData: conn.saveData,
          type: conn.type,
        });
      } else {
        setNetworkInfo({ available: false });
      }
    };

    const collectPerformanceInfo = () => {
      if ("performance" in window && window.performance.memory) {
        setPerformanceInfo({
          jsHeapSizeLimit: window.performance.memory.jsHeapSizeLimit,
          totalJSHeapSize: window.performance.memory.totalJSHeapSize,
          usedJSHeapSize: window.performance.memory.usedJSHeapSize,
        });
      }

      if ("performance" in window && window.performance.timing) {
        const timing = window.performance.timing;
        const loadTime = timing.loadEventEnd - timing.navigationStart;
        setPerformanceInfo((prev) => ({
          ...prev,
          pageLoadTime: loadTime,
          domReadyTime:
            timing.domContentLoadedEventEnd - timing.navigationStart,
        }));
      }
    };

    const getDeviceType = () => {
      const ua = navigator.userAgent;
      if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua))
        return "tablet";
      if (
        /Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/i.test(
          ua,
        )
      )
        return "mobile";
      return "desktop";
    };

    const getOS = () => {
      const ua = navigator.userAgent;
      if (ua.indexOf("Windows") !== -1) return "Windows";
      if (ua.indexOf("Mac OS") !== -1) return "macOS";
      if (ua.indexOf("Linux") !== -1) return "Linux";
      if (ua.indexOf("Android") !== -1) return "Android";
      if (
        ua.indexOf("iOS") !== -1 ||
        ua.indexOf("iPhone") !== -1 ||
        ua.indexOf("iPad") !== -1
      )
        return "iOS";
      return "Unknown";
    };

    const getOSVersion = () => {
      const ua = navigator.userAgent;
      const match = ua.match(/Windows NT (\d+\.\d+)/);
      if (match) return `Windows ${match[1]}`;
      if (ua.indexOf("Mac OS X") !== -1) {
        const version = ua.match(/Mac OS X (\d+[._]\d+)/);
        if (version) return `macOS ${version[1].replace("_", ".")}`;
      }
      return "Unknown";
    };

    const getBrowserName = () => {
      const ua = navigator.userAgent;
      if (ua.indexOf("Edg") !== -1) return "Edge";
      if (ua.indexOf("Opera") !== -1 || ua.indexOf("OPR") !== -1)
        return "Opera";
      if (ua.indexOf("Chrome") !== -1) return "Chrome";
      if (ua.indexOf("Safari") !== -1) return "Safari";
      if (ua.indexOf("Firefox") !== -1) return "Firefox";
      return "Unknown";
    };

    const getBrowserVersion = () => {
      const ua = navigator.userAgent;
      const match = ua.match(
        /(Chrome|Firefox|Safari|Edg|Opera|OPR)\/(\d+\.\d+)/,
      );
      return match ? match[2] : "Unknown";
    };

    fetchIpAddress();
    getUserTimezone();
    collectDeviceInfo();
    collectNetworkInfo();
    collectPerformanceInfo();
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
      const response = await fetch(
        "https://owlwebsitebackend.vercel.app/api/sendToTelegram",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(requestData),
        },
      );

      if (process.env.NODE_ENV === "development") {
        console.log("Response status:", response.status);
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Request failed");
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
            <h2 className="section-title">Get notified when we launch</h2>
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
                <FontAwesomeIcon icon={faRocket} /> Notify me
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
