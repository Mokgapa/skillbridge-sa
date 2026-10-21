
import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { ErrorMessage, FormField, LoadingSpinner } from "../../components";
import { useAuth } from "../../context/AuthContext";

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated } = useAuth();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const redirectTo = location.state?.from?.pathname || "/dashboard";

  if (isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    setError("");
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (!form.email.trim() || !form.password) {
      setError("Please enter your email address and password.");
      return;
    }

    setLoading(true);

    try {
      const result = await login({
        email: form.email.trim(),
        password: form.password,
      });

      const role = String(
        result?.user?.role ??
          result?.user?.role_name ??
          result?.role ??
          ""
      )
        .toLowerCase()
        .replace("role_", "");

      if (location.state?.from?.pathname) {
        navigate(redirectTo, { replace: true });
      } else if (role.includes("admin")) {
        navigate("/admin/dashboard", { replace: true });
      } else if (role.includes("employer")) {
        navigate("/employer/dashboard", { replace: true });
      } else if (role.includes("candidate")) {
        navigate("/candidate/dashboard", { replace: true });
      } else {
        navigate("/dashboard", { replace: true });
      }
    } catch (err) {
      setError(
        err?.message ||
          "Sign-in failed. Please check your details and try again."
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

          <h1>Welcome back</h1>
          <p>Sign in to continue your career journey.</p>
        </div>

        {error && <ErrorMessage message={error} />}

        <form className="auth-form" onSubmit={handleSubmit}>
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

          <div className="auth-form__password">
            <FormField
              label="Password"
              name="password"
              type={showPassword ? "text" : "password"}
              value={form.password}
              onChange={handleChange}
              placeholder="Enter your password"
              autoComplete="current-password"
              required
              disabled={loading}
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

          <div className="auth-form__options">
            <Link to="/forgot-password">Forgot password?</Link>
          </div>

          <button
            type="submit"
            className="button button--primary auth-form__submit"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>

          {loading && <LoadingSpinner />}
        </form>

        <p className="auth-card__footer">
          Don't have an account? <Link to="/register">Create one</Link>
        </p>

        <p className="auth-card__note">
          By signing in, you agree to use SkillBridge SA responsibly.
        </p>
      </section>
    </main>
  );
}
