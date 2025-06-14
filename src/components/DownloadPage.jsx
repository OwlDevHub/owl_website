import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCloudArrowDown, faCaretLeft } from "@fortawesome/free-solid-svg-icons";
import { motion } from "framer-motion";
import { useNavigate } from 'react-router-dom';

const DownloadPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    cardNumber: "",
    expDate: "",
    cvv: "",
    email: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Payment submitted:", formData);
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <motion.div
      className="download-page"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.form
        className="purchase-form"
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <h1>Download OWL</h1>
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleInputChange}
          required
        />

        <motion.button
          className="download_button"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.7 }}
        >
          <h3>
            <FontAwesomeIcon icon={faCloudArrowDown} /> GET APP
          </h3>
          <h3 className="button_subblock">TRIAL</h3>
        </motion.button>
      </motion.form>
      <button className="button back_btn" onClick={() => navigate(-1)}>
        <FontAwesomeIcon icon={faCaretLeft} />
      </button>
    </motion.div>
  );
};

export default DownloadPage;
