
import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import {
  ErrorMessage,
  FormField,
  LoadingSpinner,
} from "../../components";
import { useAuth } from "../../context/AuthContext";

const initialForm = {
  full_name: "",
  email: "",
  password: "",
  confirm_password: "",
  role: "candidate",
  agree_to_terms: false,
};

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register, isAuthenticated } = useAuth();

  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  function handleChange(event) {
    const { name, value, type, checked } = event.target;

    setForm((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));

    setError("");
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (!form.full_name.trim()) {
      setError("Please enter your full name.");
      return;
    }

    if (!form.email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    if (form.password.length < 8) {
      setError("Your password must contain at least 8 characters.");
      return;
    }

    if (form.password !== form.confirm_password) {
      setError("Your passwords do not match.");
      return;
    }

    if (!form.agree_to_terms) {
      setError("Please agree to the terms before creating your account.");
      return;
    }

    setLoading(true);

    try {
      await register({
        full_name: form.full_name.trim(),
        email: form.email.trim(),
        password: form.password,
        role: form.role,
      });

      navigate("/login", {
        replace: true,
        state: {
          message:
            "Your account has been created. Please sign in to continue.",
        },
      });
    } catch (err) {
      setError(
        err?.message ||
          "We could not create your account. Please review your details."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-card auth-card--register">
        <div className="auth-card__heading">
          <Link to="/" className="auth-card__brand">
            SkillBridge <span>SA</span>
          </Link>

          <h1>Create your account</h1>
          <p>
            Join SkillBridge SA and take the next step in your career.
          </p>
        </div>

        {error && <ErrorMessage message={error} />}

        <form className="auth-form" onSubmit={handleSubmit}>
          <FormField
            label="Full name"
            name="full_name"
            value={form.full_name}
            onChange={handleChange}
            placeholder="Enter your full name"
            autoComplete="name"
            required
            disabled={loading}
          />

          <FormField
            label="Email address"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="you@example.com"
            autoComplete="email"
            required
            disabled={loading}
          />

          <FormField
            label="I want to join as"
            name="role"
            type="select"
            value={form.role}
            onChange={handleChange}
            options={[
              { value: "candidate", label: "Candidate" },
              { value: "employer", label: "Employer" },
            ]}
            required
            disabled={loading}
          />

          <div className="auth-form__password">
            <FormField
              label="Password"
              name="password"
              type={showPassword ? "text" : "password"}
              value={form.password}
              onChange={handleChange}
              placeholder="At least 8 characters"
              autoComplete="new-password"
              required
              disabled={loading}
              hint="Use at least 8 characters."
            />

            <button
              type="button"
              className="auth-form__show-password"
              onClick={() => setShowPassword((visible) => !visible)}
              aria-pressed={showPassword}
              disabled={loading}
            >
              {showPassword ? "Hide password" : "Show password"}
            </button>
          </div>

          <FormField
            label="Confirm password"
            name="confirm_password"
            type={showPassword ? "text" : "password"}
            value={form.confirm_password}
            onChange={handleChange}
            placeholder="Enter your password again"
            autoComplete="new-password"
            required
            disabled={loading}
          />

          <label className="auth-form__terms">
            <input
              type="checkbox"
              name="agree_to_terms"
              checked={form.agree_to_terms}
              onChange={handleChange}
              disabled={loading}
              required
            />
            <span>
              I agree to the SkillBridge SA terms and privacy policy.
            </span>
          </label>

          <button
            type="submit"
            className="button button--primary auth-form__submit"
            disabled={loading}
          >
            {loading ? "Creating account..." : "Create account"}
          </button>

          {loading && <LoadingSpinner />}
        </form>

        <p className="auth-card__footer">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </section>
    </main>
  );
}
