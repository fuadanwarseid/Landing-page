import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaPhoneAlt, FaMapMarkerAlt, FaEnvelope } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom"; // Added for routing
import "./Landing.css";
import translations from "./translations.json";

const socialChannels = [
  {
    name: "TikTok",
    icon: "https://upload.wikimedia.org/wikipedia/en/a/a9/TikTok_logo.svg",
    url: "https://www.tiktok.com/@teamwork6312",
    colorClass: "tiktok",
    imageUrl:
      "https://images.unsplash.com/photo-1611162617210-7d673bf0f5c6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    actionText: { en: "Follow", am: "ተከተል" },
  },
  {
    name: "YouTube",
    icon: "https://upload.wikimedia.org/wikipedia/commons/0/09/YouTube_full-color_icon_%282017%29.svg",
    url: "https://www.youtube.com/@teamworksc",
    colorClass: "youtube",
    imageUrl:
      "https://images.unsplash.com/photo-1611162617474-5b21e879e943?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    actionText: { en: "Subscribe", am: "ይመዝገቡ" },
  },
  {
    name: "Facebook",
    icon: "https://upload.wikimedia.org/wikipedia/commons/5/51/Facebook_f_logo_%282019%29.svg",
    url: "https://www.facebook.com/groups/540668018528410",
    colorClass: "facebook",
    imageUrl:
      "https://images.unsplash.com/photo-1611162618071-8f9d2526c3c1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    actionText: { en: "Follow", am: "ተከተል" },
  },
  {
    name: "Telegram",
    icon: "https://upload.wikimedia.org/wikipedia/commons/8/82/Telegram_logo.svg",
    url: "https://www.t.me/teamwork_12",
    colorClass: "telegram",
    imageUrl:
      "https://images.unsplash.com/photo-1611162617474-5b21e879e943?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    actionText: { en: "Subscribe", am: "ይመዝገቡ" },
  },

  {
    name: "Main site",
    icon: "TW.jpg",
    url: "https://www.teamworksc.com",
    colorClass: "telegram",
    imageUrl:
      "https://images.unsplash.com/photo-1611162617474-5b21e879e943?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    actionText: { en: "View", am: "ይመልከቱ" },
  },
];

// ------------------------------
// Authentication Popup Component
// ------------------------------
const EmailFlowPopup = ({ onClose, onNavigate, language }) => {
  const [step, setStep] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const LOGIN_API = "https://api.teamworksc.com/api/v1/users/exist";

  const systems = [
    {
      name: "Urban Land and Infrastructure System",
      url: "https://city.development.teamworksc.com/",
    },
    { name: "Teacher", url: "http://teamworksw.com/FMS" },
    { name: "HRM ", url: "http://teamworksw.com/SCFMS" },
  ];

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!email || !password) {
      setMessage("Please enter both email and password.");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(LOGIN_API, { email, password });
      if (res.data.success === true) {
        setStep("select_system");
      } else {
        setMessage("Invalid email or password. Please try again.");
      }
    } catch (error) {
      setMessage("Invalid email or password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const renderContent = () => {
    switch (step) {
      case "login":
        return (
          <form onSubmit={handleLogin}>
            <h3 className="popup-title">Sign In</h3>
            <p className="popup-text">
              Enter your email and password to continue
            </p>
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="email-input"
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="email-input"
              required
            />
            <button
              type="submit"
              className="action-button primary"
              disabled={loading}
            >
              {loading ? "Checking..." : "Continue"}
            </button>
            {message && <p className="error-message">{message}</p>}
          </form>
        );

      case "select_system":
        return (
          <div className="selection-container">
            <h3 className="popup-title success">Welcome </h3>
            <p className="popup-text">Select a system to open:</p>
            <div className="links-grid">
              {systems.map((sys) => (
                <button
                  key={sys.name}
                  className="action-button link-button"
                  onClick={() => onNavigate(sys.url)}
                >
                  {sys.name}
                </button>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="popup-backdrop">
      <div className="popup-content">
        <button className="popup-close" onClick={onClose}>
          &times;
        </button>
        {renderContent()}
      </div>
    </div>
  );
};

// ------------------------------
// Social Image Block
// ------------------------------
const SocialImageBlock = ({ channel, language }) => (
  <article className={`social-block ${channel.colorClass}`}>
    <div
      className="image-preview-box"
      style={{ backgroundImage: `url(${channel.imageUrl})` }}
    >
      <div className="image-overlay">
        <img
          src={channel.icon}
          alt={`${channel.name} logo`}
          className="image-icon"
        />
        <p className="image-label">
          {language === "en"
            ? `Latest ${channel.name} Showcase`
            : `የቅርብ ጊዜ ${channel.name} ትዕይንት`}
        </p>
      </div>
    </div>
    <a
      href={channel.url}
      target="_blank"
      rel="noopener noreferrer"
      className="social-link-cta-button"
    >
      <strong>{channel.actionText[language]}</strong>{" "}
      {language === "en" ? `on ${channel.name}` : `በ${channel.name} ላይ`}
    </a>
  </article>
);

// ------------------------------
// Main Landing Page Component
// ------------------------------
const LandingPage = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [language, setLanguage] = useState("am");

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.state?.openLoginPopup) {
      setShowPopup(true);

      navigate(".", { replace: true, state: {} });
    }
  }, [location.state, navigate]);

  const handleNavigate = (url) => {
    window.location.href = url;
  };

  const goToSignup = () => {
    navigate("/signup", { state: { fromLanding: true } });
  };

  return (
    <div className="landing-page-overlay">
      <div className="landing-page-card">
        <div className="header-container">
          <div className="logo-wrapper">
            <img
              src="TW.jpg"
              alt="Teamwork IT Solutions Logo"
              className="logo-image"
            />
          </div>
          <select
            className="language-select"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
          >
            <option value="en">English</option>
            <option value="am">አማርኛ</option>
          </select>
        </div>

        <header className="hero-section">
          <h1 className="welcome-message">
            {translations[language].companyName}
          </h1>
        </header>

        <h1 className="join">{translations[language].join}</h1>

        <section id="socials" className="social-grid">
          {socialChannels.map((channel) => (
            <SocialImageBlock
              key={channel.name}
              channel={channel}
              language={language}
            />
          ))}
        </section>

        {/* Support Dropdown Section */}
        <div className="support-dropdown">
          <details>
            <summary>
              {language === "en"
                ? "How to Sign In / Sign Up (Video Guides)"
                : "እንዴት መመዝገብ /መግባት እንደሚቻል (ቪዲዮ መመሪያ)"}
            </summary>
            <ul>
              <li>
                <a
                  href="https://www.youtube.com/@teamworksc"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {"Main Website Guide"}
                </a>
              </li>
              <li>
                <a
                  href="https://www.youtube.com/@teamworksc"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {"Urban Land and Infrastructure System Guide"}
                </a>
              </li>
              <li>
                <a
                  href="https://www.youtube.com/@teamworksc"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {"HRM  Guide"}
                </a>
              </li>
              <li>
                <a
                  href="https://www.youtube.com/@teamworksc"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {"Teacher Guide"}
                </a>
              </li>
            </ul>
          </details>
        </div>

        <div className="hero-actions" style={{ marginTop: "20px" }}>
          <button className="get-started-button" onClick={goToSignup}>
            {translations[language].signup}
          </button>
          <button
            className="get-started-button"
            onClick={() => setShowPopup(true)}
          >
            {translations[language].signin}
          </button>
        </div>

        <p className="motivation-text">{translations[language].motivation}</p>
        <h2 className="slogan">{translations[language].slogan}</h2>

        <footer className="footer">
          <div className="footer-container">
            <div className="footer-about">
              <h2>Teamwork IT Solution</h2>
              <p>
                Teamwork IT Solution: Transforming Ethiopia with smart,
                innovative digital solutions that connect, inspire, and
                accelerate growth!
              </p>
              <p className="motivation">
                Let’s innovate and grow together — come and work together with
                us!
              </p>
            </div>

            <div className="contact-info">
              <h3>Contact</h3>

              <div>
                <FaMapMarkerAlt className="icon" />
                <span>Addis Ababa, Ethiopia</span>
              </div>

              <div>
                <FaEnvelope className="icon" />
                <span>teamworkitsolution3126@gmail.com</span>
              </div>
              <div>
                <FaPhoneAlt className="icon" />
                <span>0923227081 / 011 650 6569</span>
              </div>
            </div>
          </div>

          <div className="footer-bottom">
            <p>© 2025 Teamwork IT Solution. All rights reserved.</p>
            <p className="tagline">
              Powered by Innovation. Driven by Teamwork.
            </p>
          </div>
        </footer>
      </div>

      {showPopup && (
        <EmailFlowPopup
          onClose={() => setShowPopup(false)}
          onNavigate={handleNavigate}
          language={language}
        />
      )}
    </div>
  );
};

export default LandingPage;
