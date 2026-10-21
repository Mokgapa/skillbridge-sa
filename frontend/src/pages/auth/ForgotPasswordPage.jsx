
import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ErrorMessage,
  FormField,
} from "../../components";
import authService from "../../services/authService";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setSuccess(false);

    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    setLoading(true);

    try {
      await authService.forgotPassword({
        email: email.trim(),
      });
      setSuccess(true);
    } catch (err) {
      setError(
        err?.message ||
          "We could not process your request. Please try again later."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-card">
        <div className="auth-card__heading">
          <Link to="/" className="auth-card__brand">
            SkillBridge <span>SA</span>
          </Link>

          <h1>Forgot your password?</h1>
          <p>
            Enter your email address to request assistance with resetting
            your password.
          </p>
        </div>

        {error && <ErrorMessage message={error} />}

        {success ? (
          <div className="auth-success" role="status">
            <h2>Request received</h2>
            <p>
              If password recovery is available for your account, you’ll
              receive further instructions.
            </p>

            <Link to="/login" className="button button--primary">
              Return to sign in
            </Link>
          </div>
        ) : (
          <form className="auth-form" onSubmit={handleSubmit}>
            <FormField
              label="Email address"
              name="email"
              type="email"
              value={email}
              onChange={(event) => {
                setEmail(event.target.value);
                setError("");
              }}
              placeholder="you@example.com"
              autoComplete="email"
              required
              disabled={loading}
            />

            <button
              type="submit"
              className="button button--primary auth-form__submit"
              disabled={loading}
            >
              {loading ? "Submitting..." : "Request password reset"}
            </button>
          </form>
        )}

        <p className="auth-card__footer">
          Remember your password? <Link to="/login">Sign in</Link>
        </p>
      </section>
    </main>
  );
}
