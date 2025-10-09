import React, { useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCopy, faCheck } from "@fortawesome/free-solid-svg-icons";
import { motion, useInView } from "framer-motion";

const SupportSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [copied, setCopied] = useState({});

  const addresses = {
    TON: "UQBz1zAJyn9j87nHPyAkmbOsjC6ag7gIwKIXpgAeCIv-YW3O",
    USDT: "UQBz1zAJyn9j87nHPyAkmbOsjC6ag7gIwKIXpgAeCIv-YW3O",
  };

  const copyToClipboard = async (text) => {
    if (navigator.clipboard && window.isSecureContext) {
      try {
        await navigator.clipboard.writeText(text);
        return true;
      } catch (err) {
        console.warn("Modern clipboard API failed:", err);
      }
    }

    try {
      const textArea = document.createElement("textarea");
      textArea.value = text;
      textArea.style.position = "fixed";
      textArea.style.opacity = "0";
      document.body.appendChild(textArea);
      textArea.select();
      textArea.setSelectionRange(0, 99999);

      const successful = document.execCommand("copy");
      document.body.removeChild(textArea);

      return successful;
    } catch (err) {
      console.warn("execCommand failed:", err);
    }

    return false;
  };

  const handleCopy = async (type) => {
    const success = await copyToClipboard(addresses[type]);

    if (success) {
      setCopied((prev) => ({ ...prev, [type]: true }));
      setTimeout(() => {
        setCopied((prev) => ({ ...prev, [type]: false }));
      }, 2000);
    } else {
      alert(`Please copy this ${type} address manually:\n\n${addresses[type]}`);
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
        Support
        <br />
        developer
      </h1>
      <div className="support_grid">
        {Object.entries(addresses).map(([key, address]) => (
          <div className="support_block" key={key}>
            <h1>{key}</h1>
            <p
              style={{
                userSelect: "text",
                WebkitUserSelect: "text",
                MozUserSelect: "text",
                msUserSelect: "text",
              }}
            >
              {address}
            </p>
            <button
              onClick={() => handleCopy(key)}
              aria-label={`Copy ${key} address`}
              className="copy_button"
              style={{
                cursor: "pointer",
                border: "none",
                background: "transparent",
                color: "var(--fg)",
                transition: "background-color 0.2s",
              }}
            >
              {copied[key] ? (
                <>
                  <FontAwesomeIcon
                    icon={faCheck}
                    style={{ color: "var(--green)" }}
                  />
                  <span style={{ marginLeft: "8px" }}>Copied!</span>
                </>
              ) : (
                <>
                  <FontAwesomeIcon icon={faCopy} />
                  <span style={{ marginLeft: "8px" }}>Copy</span>
                </>
              )}
            </button>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default SupportSection;
