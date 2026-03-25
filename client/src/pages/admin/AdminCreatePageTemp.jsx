import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { http } from "../../api/http";

export const AdminCreatePageTemp = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState("create");
  const [setupKey, setSetupKey] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [devCode, setDevCode] = useState("");

  const createAdmin = async (e) => {
    e.preventDefault();
    setError("");
    setInfo("");
    setDevCode("");

    try {
      const { data } = await http.post("/auth/setup-admin", {
        setupKey,
        name,
        email,
        password
      });

      setInfo(data.message || "Admin created.");
      if (data.devVerificationCode) {
        setDevCode(`Dev verification code: ${data.devVerificationCode}`);
      }
      setStep("verify");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create admin");
    }
  };

  const verifyEmail = async (e) => {
    e.preventDefault();
    setError("");
    setInfo("");

    try {
      const { data } = await http.post("/auth/verify-email", {
        email,
        code: verificationCode
      });
      setInfo(data.message || "Gmail verified successfully.");
      setTimeout(() => navigate("/admin/login"), 800);
    } catch (err) {
      setError(err.response?.data?.message || "Email verification failed");
    }
  };

  const resendCode = async () => {
    setError("");
    setInfo("");
    setDevCode("");

    try {
      const { data } = await http.post("/auth/resend-verification", { email });
      setInfo(data.message || "Verification code sent.");
      if (data.devVerificationCode) {
        setDevCode(`Dev verification code: ${data.devVerificationCode}`);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to resend code");
    }
  };

  return (
    <main className="container">
      <section className="form-card narrow">
        <h1>Admin Create Temp</h1>
        <p>This temporary page is for creating an admin and verifying Gmail.</p>

        {step === "create" ? (
          <form onSubmit={createAdmin} className="form-grid">
            <label>
              Setup Key
              <input
                type="text"
                value={setupKey}
                onChange={(e) => setSetupKey(e.target.value)}
                required
              />
            </label>
            <label>
              Name
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
            </label>
            <label>
              Gmail
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </label>
            <label>
              Password
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                minLength={6}
                required
              />
            </label>
            <button type="submit" className="primary-btn">
              Create Admin
            </button>
          </form>
        ) : (
          <form onSubmit={verifyEmail} className="form-grid">
            <label>
              Gmail
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </label>
            <label>
              Verification Code
              <input
                type="text"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                maxLength={6}
                required
              />
            </label>
            <button type="submit" className="primary-btn">
              Verify Gmail
            </button>
            <button type="button" className="secondary-btn" onClick={resendCode}>
              Resend Code
            </button>
            <button type="button" className="secondary-btn" onClick={() => setStep("create")}>
              Back
            </button>
          </form>
        )}

        {error ? <p className="error">{error}</p> : null}
        {info ? <p className="success">{info}</p> : null}
        {devCode ? <p>{devCode}</p> : null}

        <p>
          Go to <Link to="/admin/login">Admin Login</Link>
        </p>
      </section>
    </main>
  );
};
