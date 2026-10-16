import { useState } from "react";
import "./PasswordGate.scss";

function ResumeAccessPage() {
  const [closing, setClosing] = useState(false);

  const handleAcknowledge = () => {
    setClosing(true);
    setTimeout(() => {
      localStorage.setItem("unlocked", "true");
      window.location.href = "/";
    }, 500);
  };

  return (
    <div className={`resume-access${closing ? " resume-access--closing" : ""}`}>
      <h1>Whitney Kluttz</h1>
      <p className="resume-access__message">
        This link bypasses the password on this portfolio.
        Please only share it internally within your business.
      </p>
      <button className="resume-access__button" onClick={handleAcknowledge}>
        I understand, continue
      </button>
    </div>
  );
}

export default ResumeAccessPage;