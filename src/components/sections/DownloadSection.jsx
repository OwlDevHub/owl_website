import React, { useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRocket } from "@fortawesome/free-solid-svg-icons";
import { motion, useInView } from "framer-motion";

const DownloadSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  const [email, setEmail] = useState("");
  const [status, setStatus] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();

    setStatus("sending");

    const deviceInfo = window.navigator.userAgent;

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
        className="download-buttons"
        initial={{ scale: 0.8 }}
        animate={{ scale: isInView ? 1 : 0.8 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        style={{
          display: "flex",
          flexDirection: "column",
          width: "350px",
          maxWidth: "350px",
        }}
      >
        <motion.input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="ENTER YOUR EMAIL"
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: isInView ? 0 : 100, opacity: isInView ? 1 : 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          style={{ padding: "10px", width: "350px", height: "20px" }}
        />
        <motion.button
          type="submit"
          className="download_button"
          whileTap={{ scale: 0.95 }}
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: isInView ? 0 : 100, opacity: isInView ? 1 : 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          style={{ padding: "10px", height: "40px", width: "350px" }}
          disabled={status === "sending"}
        >
          <h3>
            <FontAwesomeIcon icon={faRocket} /> NOTIFY ME
          </h3>
        </motion.button>
        {status === "success" && (
          <div style={{ color: "var(--green)" }}>
            Thanks! You have been added to the waiting list.
          </div>
        )}
        {status === "error" && (
          <div style={{ color: "var(--red)" }}>
            Error when sending. Try again later.
          </div>
        )}
      </motion.form>
    </motion.div>
  );
};

export default DownloadSection;
