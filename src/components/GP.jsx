import React, { useState, useEffect } from "react";
import "./GP.css";

const GuidePopup = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [countdown, setCountdown] = useState(20);

  useEffect(() => {
    const showTimer = setTimeout(() => {
      setShowPopup(true);
    }, 10000);

    return () => clearTimeout(showTimer);
  }, []);

  useEffect(() => {
    if (showPopup && countdown > 0) {
      const timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else if (showPopup && countdown === 0) {
      handleSkip();
    }
  }, [showPopup, countdown]);

  const handleViewGuide = () => {
    window.open("https://youtu.be/PIiOX7YETIY?si=pKXeS6tlijqL0RZh", "_blank");
    setShowPopup(false);
  };

  const handleSkip = () => {
    setShowPopup(false);
  };

  if (!showPopup) return null;

  return (
    <div className="guide-popup-overlay">
      <div className="guide-popup">
        <div className="countdown-timer">{countdown}s</div>

        <h2> እንኳን ደህና መጡ!</h2>
        <p>ከመጀመርዎ በፊት ይህን መመሪያ ቪዲዮ ይመልከቱ እንዴት መመዝገብና መግባት እንደሚቻል ያሳያል</p>

        <div className="thumbnail-container" onClick={handleViewGuide}>
          <img src="team.png" alt="መመሪያ ቪዲዮ" className="thumbnail-img" />
          <div className="play-button">▶</div>
        </div>

        <div className="guide-buttons">
          <button className="view-btn" onClick={handleViewGuide}>
            ▶ ሙሉ መመሪያውን ይመልከቱ
          </button>
          <button className="skip-btn" onClick={handleSkip}>
            ⏭ ዝለል
          </button>
        </div>
      </div>
    </div>
  );
};

export default GuidePopup;
