import React, { useState } from 'react';
import axios from "axios";
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
    name: "Instagram",
    icon: "https://upload.wikimedia.org/wikipedia/commons/e/e7/Instagram_logo_2016.svg",
    url: "https://www.instagram.com/teamworkitsolution_3126/",
    colorClass: "instagram",
    imageUrl:
      "https://images.unsplash.com/photo-1611162617474-5b21e879e943?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    actionText: { en: "Follow", am: "ተከተል" },
  },
  {
    name: "Twitter",
    icon: "https://images.unsplash.com/photo-1611605698335-8b1569810432?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    url: "https://www.x.com/TeamworkIT3",
    colorClass: "twitter",
    imageUrl:
      "https://images.unsplash.com/photo-1611162617474-5b21e879e943?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    actionText: { en: "Follow", am: "ተከተል" },
  },
  {
    name: "LinkedIn",
    icon: "https://upload.wikimedia.org/wikipedia/commons/8/81/LinkedIn_icon.svg",
    url: "https://www.linkedin.com/company/108359956/",
    colorClass: "tiktok",
    imageUrl:
      "https://images.unsplash.com/photo-1611162618071-8f9d2526c3c1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    actionText: { en: "Subscribe", am: "ይመዝገቡ" },
  },
  {
    name: "Main site",
    icon: "TW.jpg",
    url: "https://www.teamworksc.com",
    colorClass: "telegram",
    imageUrl:
      "https://images.unsplash.com/photo-1611162617474-5b21e879e943?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    actionText: { en: "view", am: "ይመልከቱ" },
  },
];

const EmailFlowPopup = ({ onClose, onNavigate, language }) => {
  const [step, setStep] = useState("phone_input");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [systems, setSystems] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    if (!phone || phone.length < 5) {
      setMessage(translations[language].popup.invalidPhone);
      return;
    }

    setLoading(true);
    try {
      // ===============================
      // ⚡ API placeholders for 3 systems
      // Replace these with your actual backend endpoints
      const api1 = "YOUR_API_FOR_SYSTEM_1";
      const api2 = "YOUR_API_FOR_SYSTEM_2";
      const api3 = "YOUR_API_FOR_SYSTEM_3";
      // ===============================

      // Make requests in parallel
      const [res1, res2, res3] = await Promise.all([
        axios.post(api1, { phone }),
        axios.post(api2, { phone }),
        axios.post(api3, { phone }),
      ]);

      // Check existence in each system
      const existsInSystem1 = res1.data.exists;
      const existsInSystem2 = res2.data.exists;
      const existsInSystem3 = res3.data.exists;

      // Aggregate systems info for selection
      const availableSystems = [];
      if (existsInSystem1)
        availableSystems.push({ name: "System 1", url: "SYSTEM_1_URL" });
      if (existsInSystem2)
        availableSystems.push({ name: "System 2", url: "SYSTEM_2_URL" });
      if (existsInSystem3)
        availableSystems.push({ name: "System 3", url: "SYSTEM_3_URL" });

      // Decide what to show next
      if (existsInSystem1 && existsInSystem2 && existsInSystem3) {
        setSystems(availableSystems);
        setStep("select_system");
      } else {
        setMessage(
          translations[language].popup.notPresent ||
            "Sorry! You are not registered in all 3 systems."
        );
        setStep("register");
      }
    } catch (error) {
      console.error(error);
      setMessage(
        translations[language].popup.apiError || "Error checking phone."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterClick = () => {
    onNavigate("https://teamworksc.com/signup");
  };

  const renderContent = () => {
    const t = translations[language].popup;
    switch (step) {
      case "phone_input":
        return (
          <form onSubmit={handleSubmit}>
            <h3 className="popup-title">{t.title}</h3>
            <p className="popup-text">{t.text}</p>
            <input
              type="tel"
              placeholder="09xxxxxxxx"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="email-input"
              required
            />
            <button
              type="submit"
              className="action-button primary"
              disabled={loading}
            >
              {loading ? t.checking : t.continue}
            </button>
            {message && <p className="error-message">{message}</p>}
          </form>
        );

      case "select_system":
        return (
          <div className="selection-container">
            <h3 className="popup-title success">
              {t.welcome} {phone}
            </h3>
            <p className="popup-text">{t.selectSystem}</p>
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
            <button
              onClick={() => {
                setStep("phone_input");
                setPhone("");
              }}
              className="action-button secondary small"
            >
              {t.differentPhone}
            </button>
          </div>
        );

      case "register":
        return (
          <div className="selection-container">
            <h3 className="popup-title warning">{t.newUser}</h3>
            <p className="popup-text">
              {t.notRegistered.replace("{phone}", phone)}
            </p>
            <button
              onClick={handleRegisterClick}
              className="action-button register-button"
            >
              {t.register}
            </button>
            <button
              onClick={() => setStep("phone_input")}
              className="action-button secondary small"
            >
              {t.differentPhone}
            </button>
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

const LandingPage = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [language, setLanguage] = useState("am");

  const handleNavigate = (url) => {
    window.location.href = url;
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

        <div className="hero-actions" style={{ marginTop: "20px" }}>
          <button
            className="get-started-button"
            onClick={() => handleNavigate("https://teamworksc.com/signup")}
          >
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
        {/* footer */}
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

            <div className="footer-contact">
              <h3>Contact</h3>
              <p>📍 Addis Ababa, Ethiopia</p>
              <p>📧 teamworkitsolution3126@gmail.com</p>
              <p>📞 0923227081 / 011 650 6569</p>
            </div>
          </div>

          <div className="footer-bottom">
            <p>© 2025 Teamwork IT Solution. All rights reserved.</p>
            <p className="tagline">
              {" "}
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
