const API_URL = "https://owlwebsitebackend.vercel.app/api/sendToTelegram";

export async function fetchIpAddress() {
  const response = await fetch("https://api.ipify.org?format=json");
  if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
  const data = await response.json();
  return data.ip;
}

export function getUserTimezone() {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
}

export function getScreenInfo() {
  return {
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
  };
}

export function getBrowserInfo() {
  const ua = navigator.userAgent;
  return {
    userAgent: ua,
    platform: navigator.platform,
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
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua),
    isTablet: /iPad|Android(?!.*Mobile)/i.test(ua),
  };
}

function getDeviceType() {
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
}

function getOS() {
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
}

function getOSVersion() {
  const ua = navigator.userAgent;
  const match = ua.match(/Windows NT (\d+\.\d+)/);
  if (match) return `Windows ${match[1]}`;
  if (ua.indexOf("Mac OS X") !== -1) {
    const version = ua.match(/Mac OS X (\d+[._]\d+)/);
    if (version) return `macOS ${version[1].replace("_", ".")}`;
  }
  return "Unknown";
}

function getBrowserName() {
  const ua = navigator.userAgent;
  if (ua.indexOf("Edg") !== -1) return "Edge";
  if (ua.indexOf("Opera") !== -1 || ua.indexOf("OPR") !== -1) return "Opera";
  if (ua.indexOf("Chrome") !== -1) return "Chrome";
  if (ua.indexOf("Safari") !== -1) return "Safari";
  if (ua.indexOf("Firefox") !== -1) return "Firefox";
  return "Unknown";
}

function getBrowserVersion() {
  const ua = navigator.userAgent;
  const match = ua.match(/(Chrome|Firefox|Safari|Edg|Opera|OPR)\/(\d+\.\d+)/);
  return match ? match[2] : "Unknown";
}

export function getDeviceData() {
  return {
    deviceType: getDeviceType(),
    os: getOS(),
    osVersion: getOSVersion(),
    browserName: getBrowserName(),
    browserVersion: getBrowserVersion(),
  };
}

export function getNetworkInfo() {
  if ("connection" in navigator) {
    const conn = navigator.connection;
    return {
      effectiveType: conn.effectiveType,
      downlink: conn.downlink,
      rtt: conn.rtt,
      saveData: conn.saveData,
      type: conn.type,
    };
  }
  return { available: false };
}

export function getPerformanceInfo() {
  let info = {};

  if ("performance" in window && window.performance.memory) {
    info = {
      jsHeapSizeLimit: window.performance.memory.jsHeapSizeLimit,
      totalJSHeapSize: window.performance.memory.totalJSHeapSize,
      usedJSHeapSize: window.performance.memory.usedJSHeapSize,
    };
  }

  if ("performance" in window && window.performance.timing) {
    const timing = window.performance.timing;
    info = {
      ...info,
      pageLoadTime: timing.loadEventEnd - timing.navigationStart,
      domReadyTime:
        timing.domContentLoadedEventEnd - timing.navigationStart,
    };
  }

  return info;
}

export async function sendToTelegram(data) {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Request failed");
  }

  return response;
}
