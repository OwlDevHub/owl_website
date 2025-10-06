import React, { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRocket } from "@fortawesome/free-solid-svg-icons";
import { motion, useInView } from "framer-motion";

const DownloadSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

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
    <motion.div
      className="download_app"
      id="download_app"
      ref={ref}
      initial={{ opacity: 0, y: 100 }}
      animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 100 }}
      transition={{ duration: 0.8 }}
    >
      <h1>
        Get notified
        <br />
        when we launch
      </h1>
      <motion.form
        onSubmit={handleSubmit}
        className="download-buttons download-form"
        initial={{ scale: 0.8 }}
        animate={{ scale: isInView ? 1 : 0.8 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <motion.input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="ENTER YOUR EMAIL"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: isInView ? 0 : 50, opacity: isInView ? 1 : 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="download-input"
        />
        <motion.button
          type="submit"
          className="download-submit download_button"
          whileTap={{ scale: 0.95 }}
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: isInView ? 0 : 50, opacity: isInView ? 1 : 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          disabled={status === "sending"}
        >
          <h3>
            <FontAwesomeIcon icon={faRocket} /> NOTIFY ME
          </h3>
        </motion.button>
        {status === "success" && (
          <h3 className="status-success">
            Thanks! You have been added to the waiting list.
          </h3>
        )}
        {status === "error" && (
          <h3 className="status-error">Error when sending. Try again later.</h3>
        )}
      </motion.form>
    </motion.div>
  );
};

export default DownloadSection;
