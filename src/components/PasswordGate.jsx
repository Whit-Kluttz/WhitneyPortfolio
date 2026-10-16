import { useState } from "react";
import "./PasswordGate.scss";

function PasswordGate({ children }) {
  const [unlocked, setUnlocked] = useState(
    localStorage.getItem("unlocked") === "true"
  );
  const [closing, setClosing] = useState(false);
  const [input, setInput] = useState("");
  const [shake, setShake] = useState(false);

  const handleChange = (e) => {
    const digitsOnly = e.target.value.replace(/\D/g, "").slice(0, 6);
    setInput(digitsOnly);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input === "666555") {
      localStorage.setItem("unlocked", "true");
      setClosing(true);
      setTimeout(() => setUnlocked(true), 500);
    } else {
      setShake(true);
      setTimeout(() => setShake(false), 400);
    }
  };

  return (
    <>
      {(closing || unlocked) && children}
      {!unlocked && (
        <div className={`password-gate${closing ? " password-gate--closing" : ""}`}>
          <h1>Whitney Kluttz Portfolio</h1>
          <p>Please enter provided password to access protected Portfolio</p>
          <form onSubmit={handleSubmit}>
            <input
              className="password-gate__input"
              type="text"
              inputMode="numeric"
              value={input}
              onChange={handleChange}
            />
            <button
              className={`password-gate__button${shake ? " password-gate__button--shake" : ""}`}
              type="submit"
            >
              Enter
            </button>
          </form>
        </div>
      )}
    </>
  );
}

export default PasswordGate;