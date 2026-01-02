import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import "./SignupPage.css";

const SignupPage = () => {
  const navigate = useNavigate();

  const [step, setStep] = useState("form");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [otp, setOtp] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({});

  // OTP Timer
  const [timer, setTimer] = useState(300);
  const [canResend, setCanResend] = useState(false);

  const SEND_OTP_API = "https://api.teamworksc.com/api/v1/auth/send-otp";
  const VERIFY_OTP_API = "https://api.teamworksc.com/api/v1/auth/verify-otp";

  // Timer countdown
  useEffect(() => {
    if (step === "otp" && timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [step, timer]);


  const formatTime = () => {
    const minutes = Math.floor(timer / 60);
    const seconds = timer % 60;
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: "" });
    setMessage("");
  };

  const handlePhoneChange = (value) => {
    setFormData({ ...formData, phone: value });
    setErrors({ ...errors, phone: "" });
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) newErrors.firstName = "First Name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last Name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Email is invalid";

    if (!formData.phone || formData.phone.length < 10) newErrors.phone = "Please enter a valid phone number.";

    if (!formData.password) newErrors.password = "Password is required";
    else if (formData.password.length < 8) newErrors.password = "Password must be at least 8 characters";

    if (!formData.confirmPassword) newErrors.confirmPassword = "Confirm Password is required";
    else if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setMessage("");
    if (!validateForm()) return;

    setLoading(true);

    const fullName = `${formData.firstName.trim()} ${formData.lastName.trim()}`;
    const cleanPhone = formData.phone.replace(/^\+/, "");

    const payload = {
      name: fullName,
      email: formData.email.trim(),
      phoneNumber: cleanPhone,
      password: formData.password,
    };

    try {
      const res = await axios.post(SEND_OTP_API, payload);
      if (res.data.success) {
        setMessage("OTP sent successfully to your email!");
        setStep("otp");
        setTimer(300); 
        setCanResend(false);
      } else {
        setMessage(res.data.message || "Failed to send OTP.");
      }
    } catch (err) {
      setMessage(err.response?.data?.message || "Network error");
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    if (otp.length !== 6) {
      setMessage("Please enter the full 6-digit OTP.");
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post(VERIFY_OTP_API, {
        email: formData.email,
        otp: otp.trim(),
      });
      if (res.data.success) {
        setMessage("Registration successful!");
        navigate("/", { state: { openLoginPopup: true }, replace: true });
      } else {
        setMessage(res.data.message || "Invalid OTP");
      }
    } catch (err) {
      setMessage(err.response?.data?.message || "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  // Resend OTP
  const handleResendOTP = async () => {
    if (!canResend) return;

    setLoading(true);
    setMessage("");

    const fullName = `${formData.firstName.trim()} ${formData.lastName.trim()}`;
    const cleanPhone = formData.phone.replace(/^\+/, "");

    const payload = {
      name: fullName,
      email: formData.email.trim(),
      phoneNumber: cleanPhone,
      password: formData.password,
    };

    try {
      const res = await axios.post(SEND_OTP_API, payload);
      if (res.data.success) {
        setMessage("New OTP sent successfully!");
        setTimer(180);
        setCanResend(false);
        setOtp("");
      } else {
        setMessage("Failed to resend OTP.");
      }
    } catch (err) {
      setMessage("Error resending OTP.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-container">
      <h1 className="main-title">Create Your Account</h1>

      <div className="signup-card">
        {step === "form" ? (
          <form onSubmit={handleRegister}>
            <div className="row">
              <div className="field">
                <label>First Name</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                />
                {errors.firstName && <span className="error">{errors.firstName}</span>}
              </div>
              <div className="field">
                <label>Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                />
                {errors.lastName && <span className="error">{errors.lastName}</span>}
              </div>
            </div>

            <div className="row">
              <div className="field">
                <label>Email address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                />
                {errors.email && <span className="error">{errors.email}</span>}
              </div>
              <div className="field">
                <label>Phone Number</label>
                <PhoneInput
                  country="et"
                  value={formData.phone}
                  onChange={handlePhoneChange}
                  inputProps={{ required: true }}
                />
                {errors.phone && <span className="error">{errors.phone}</span>}
              </div>
            </div>

            <div className="field full">
              <label>Password</label>
              <div className="password-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                />
                <span
                  className="eye-icon"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "👁️" : "👁️‍🗨️"}
                </span>
              </div>
              {errors.password && <span className="error">{errors.password}</span>}
            </div>

            <div className="field full">
              <label>Confirm Password</label>
              <div className="password-wrapper">
                <input
                  type={showConfirm ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                />
                <span
                  className="eye-icon"
                  onClick={() => setShowConfirm(!showConfirm)}
                >
                  {showConfirm ? "👁️" : "👁️‍🗨️"}
                </span>
              </div>
              {errors.confirmPassword && <span className="error">{errors.confirmPassword}</span>}
            </div>

            <button type="submit" className="register-btn" disabled={loading}>
              {loading ? "Sending OTP..." : "Register"}
            </button>
          </form>
        ) : (
          <div className="otp-section">
            <h2 className="otp-title">Verify OTP</h2>

            <p className="otp-timer">
              Time left: <span className="timer-display">{formatTime()}</span> minutes
            </p>

            <p className="otp-instruction">
              Please enter the 6-digit OTP sent to your email
            </p>

            <div className="opt">
<input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) =>
                setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
              }
              maxLength="6"
              className="otp-input"
              autoFocus
            />
            </div>

            <button
              onClick={handleVerify}
              className="register-btn"
              disabled={loading}
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </button>

            <p className="resend-container">
              Didn't receive OTP?{" "}
              <span
                onClick={handleResendOTP}
                className={`resend-link ${canResend ? "active" : "disabled"}`}
              >
                Resend OTP
              </span>
            </p>

            <button
              type="button"
              onClick={() => setStep("form")}
              className="back-link"
            >
              Back
            </button>
          </div>
        )}

        {message && (
          <div className={`feedback ${message.includes("success") || message.includes("sent") ? "success" : "error"}`}>
            {message}
          </div>
        )}
      </div>

      <div className="back-to-home">
        <button type="button" onClick={() => navigate("/")} className="link-button">
          ← Back to Home
        </button>
      </div>
    </div>
  );
};

export default SignupPage;