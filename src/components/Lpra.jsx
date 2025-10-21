import React, { useState } from 'react';
import axios from "axios";
import './Landing.css';
import translations from './translations.json';

const socialChannels = [
  {
    name: 'TikTok',
    icon: 'https://upload.wikimedia.org/wikipedia/en/a/a9/TikTok_logo.svg',
    url: 'https://www.tiktok.com/@teamworkit1?is_from_webapp=1&sender_device=pc',
    colorClass: 'tiktok',
    imageUrl: 'https://images.unsplash.com/photo-1611162617210-7d673bf0f5c6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    actionText: { en: 'Follow', am: 'ተከተል' }
  },
  {
    name: 'YouTube',
    icon: 'https://upload.wikimedia.org/wikipedia/commons/0/09/YouTube_full-color_icon_%282017%29.svg',
    url: 'http://www.youtube.com/@teamworksc',
    colorClass: 'youtube',
    imageUrl: 'https://images.unsplash.com/photo-1611162617474-5b21e879e943?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    actionText: { en: 'Subscribe', am: 'ይመዝገቡ' }
  },
  {
    name: 'Facebook',
    icon: 'https://upload.wikimedia.org/wikipedia/commons/5/51/Facebook_f_logo_%282019%29.svg',
    url: 'https://facebook.com/groups/540668018528410',
    colorClass: 'facebook',
    imageUrl: 'https://images.unsplash.com/photo-1611162618071-8f9d2526c3c1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    actionText: { en: 'Follow', am: 'ተከተል' }
  },
  {
    name: 'Telegram',
    icon: 'https://upload.wikimedia.org/wikipedia/commons/8/82/Telegram_logo.svg',
    url: 'https://t.me/teamwork_12',
    colorClass: 'telegram',
    imageUrl: 'https://images.unsplash.com/photo-1611162618071-8f9d2526c3c1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    actionText: { en: 'Subscribe', am: 'ይመዝገቡ' }
  }
];


const EmailFlowPopup = ({ onClose, onNavigate, language }) => {
  const [step, setStep] = useState('email_input');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);


  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    if (!email.includes('@') || email.length < 5) {
      setMessage(translations[language].popup.invalidEmail);
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post('https://api.teamworksc.com/api/v1/users/exist', { email });
      console.log('Success:', response.data.exists);

      if (response.data.exists) {
        setStep('select_link');
      } else {
        setStep('register');
      }
    } catch (error) {
      console.error('Error:', error.response?.data || error.message);
      setMessage(translations[language].popup.apiError || 'Error checking email.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterClick = () => {
   
    onNavigate('https://teamworksc.com/signup');
  };

  const renderContent = () => {
    const t = translations[language].popup;
    switch (step) {
      case 'email_input':
        return (
          <form onSubmit={handleSubmit} aria-label="Email check form">
            <h3 className="popup-title">{t.title}</h3>
            <p className="popup-text">{t.text}</p>
            <input
              type="email"
              placeholder="your.email@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="email-input"
              required
              aria-required="true"
            />
            <button type="submit" className="action-button primary" disabled={loading}>
              {loading ? t.checking : t.continue}
            </button>
            {message && <p role="alert" className="error-message">{message}</p>}
          </form>
        );

      case 'select_link':
        return (
          <div className="selection-container">
            <h3 className="popup-title success">{t.welcome} {email.split('@')[0]}!</h3>
            <p className="popup-text">{t.selectLink}</p>
            <div className="links-grid">
              {translations[language].links.map((link) => (
                <a
                  key={link.name}
                  href={link.url}
                  target="_self"
                  className="action-button link-button"
                  onClick={(e) => { e.preventDefault(); onNavigate(link.url); }}
                >
                  {link.name}
                </a>
              ))}
            </div>
            <button onClick={() => { setStep('email_input'); setEmail(''); }} className="action-button secondary small">
              {t.differentEmail}
            </button>
          </div>
        );

      case 'register':
        return (
          <div className="selection-container">
            <h3 className="popup-title warning">{t.newUser}</h3>
            <p className="popup-text" dangerouslySetInnerHTML={{ __html: t.notRegistered.replace('{email}', email) }} />
            <button onClick={handleRegisterClick} className="action-button register-button">
              {t.register}
            </button>
            <button onClick={() => setStep('email_input')} className="action-button secondary small">
              {t.differentEmail}
            </button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="popup-backdrop" role="dialog" aria-modal="true" aria-label="Email flow dialog">
      <div className="popup-content">
        <button className="popup-close" onClick={onClose} aria-label="Close popup">&times;</button>
        {renderContent()}
      </div>
    </div>
  );
};


const SocialImageBlock = ({ channel, language }) => (
  <article className={`social-block ${channel.colorClass}`} aria-labelledby={`label-${channel.name}`}>
    <div
      className="image-preview-box"
      style={{ backgroundImage: `url(${channel.imageUrl})` }}
      role="img"
      aria-label={`${channel.name} preview`}
    >
      <div className="image-overlay">
        <img src={channel.icon} alt={`${channel.name} logo`} className="image-icon" />
        <p id={`label-${channel.name}`} className="image-label">
          {language === 'en' ? `Latest ${channel.name} Showcase` : `የቅርብ ጊዜ ${channel.name} ትዕይንት`}
        </p>
      </div>
    </div>

    <a
      href={channel.url}
      target="_blank"
      rel="noopener noreferrer"
      className="social-link-cta-button"
      aria-label={`${channel.actionText[language]} on ${channel.name}`}
    >
      <strong>{channel.actionText[language]}</strong> {language === 'en' ? `on ${channel.name}` : `በ${channel.name} ላይ`}
    </a>
  </article>
);


const LandingPage = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [language, setLanguage] = useState('en');

  const handleNavigate = (url) => {
    console.log(`Navigating to: ${url}`);
    window.location.href = url;
  };

  return (
    <div className="landing-page-overlay">
      <div className="landing-page-card" role="main">
        <div className="header-container">
          <div className="logo-wrapper" aria-hidden="true">
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
            aria-label="Select language"
          >
            <option value="en">English</option>
            <option value="am">አማርኛ</option>
          </select>
        </div>

        <header className="hero-section">
          <h1 className="welcome-message">{translations[language].companyName}</h1>
          <h2 className="slogan">{translations[language].slogan}</h2>
          <div className="hero-actions">
            <button className="get-started-button" onClick={() => setShowPopup(true)} aria-haspopup="dialog">
              {translations[language].getStarted}
            </button>
          </div>
          <p className="motivation-text">{translations[language].motivation}</p>
        </header>

        <section id="socials" className="social-grid" aria-label="Social channels">
          {socialChannels.map((channel) => (
            <SocialImageBlock key={channel.name} channel={channel} language={language} />
          ))}
        </section>
      </div>

      {showPopup && <EmailFlowPopup onClose={() => setShowPopup(false)} onNavigate={handleNavigate} language={language} />}
    </div>
  );
};

export default LandingPage;
