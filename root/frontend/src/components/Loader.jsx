import { useEffect, useState } from "react";

const MESSAGES = [
  "Waking up the server…",
  "Fetching holiday data…",
  "Crunching the numbers…",
  "Almost there…",
];

export default function Loader() {
  const [msgIndex, setMsgIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMsgIndex((i) => (i + 1 < MESSAGES.length ? i + 1 : i));
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="loader-overlay">
      <div className="loader-box">
        <div className="loader-spinner">
          <div className="spinner-ring" />
        </div>
        <p className="loader-msg">{MESSAGES[msgIndex]}</p>
        <p className="loader-sub">
          Free tier server may take up to 30s on first request
        </p>
      </div>
    </div>
  );
}
