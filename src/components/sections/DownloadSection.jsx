import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRocket } from "@fortawesome/free-solid-svg-icons";

const DownloadSection = () => {
  const [email, setEmail] = useState("");
  const [ipAddr, setIpAddr] = useState("");
  const [status, setStatus] = useState(null);

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
    fetchIpAddress();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus("sending");

    const deviceInfo =
      "User-Agent: " + window.navigator.userAgent + "\n\nIP: " + ipAddr;

    try {
      const response = await fetch(
        "https://owlwebsitebackend.vercel.app/api/sendToTelegram",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, deviceInfo }),
        },
      );

      if (!response.ok) throw new Error("Error");

      setStatus("success");
      setEmail("");
    } catch (error) {
      setStatus("error");
      console.error(error);
    }
  };

  return (
    <div className="download" id="download_app">
      <h2 className="about-badge">GET NOTIFIED WHEN WE LAUNCH</h2>
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
        {status === "sending" && (
          <p className="status-wait">Sending a request. Please wait</p>
        )}
        {status === "success" && (
          <p className="status-success">
            Thanks! You have been added to the waiting list.
          </p>
        )}
        {status === "error" && (
          <p className="status-error">Error when sending. Try again later.</p>
        )}
      </form>
    </div>
  );
};

export default DownloadSection;
