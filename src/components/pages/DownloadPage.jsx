import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCloudArrowDown,
  faCaretLeft,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

const DownloadPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="download-page">
      <form className="purchase-form" onSubmit={handleSubmit}>
        <h1 className="about-badge">Download OWL</h1>
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleInputChange}
          required
        />
        <button
          type="submit"
          className="download-button"
          style={{ width: "100%" }}
        >
          <FontAwesomeIcon icon={faCloudArrowDown} /> GET APP TRIAL
        </button>
      </form>
      <button className="back_btn" onClick={() => navigate(-1)}>
        <FontAwesomeIcon icon={faCaretLeft} />
      </button>
    </div>
  );
};

export default DownloadPage;
