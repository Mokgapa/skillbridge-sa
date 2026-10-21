
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ErrorMessage,
  FormField,
  LoadingSpinner,
} from "../../components";
import candidateService from "../../services/candidateService";
import { useAuth } from "../../context/AuthContext";

const initialForm = {
  full_name: "",
  headline: "",
  bio: "",
  location: "",
  phone: "",
  career_interests: "",
  linkedin_url: "",
  portfolio_url: "",
};

function profileToForm(profile) {
  return {
    full_name: profile?.full_name ?? "",
    headline: profile?.headline ?? "",
    bio: profile?.bio ?? "",
    location: profile?.location ?? "",
    phone: profile?.phone ?? "",
    career_interests: Array.isArray(profile?.career_interests)
      ? profile.career_interests.join(", ")
      : profile?.career_interests ?? "",
    linkedin_url: profile?.linkedin_url ?? "",
    portfolio_url: profile?.portfolio_url ?? "",
  };
}

export default function CandidateProfilePage() {
  const { user, updateUser } = useAuth();

  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    let active = true;

    async function loadProfile() {
      setLoading(true);
      setError("");

      try {
        const response = await candidateService.getProfile();
        const profile =
          response?.data?.profile ??
          response?.profile ??
          response?.data ??
          response;

        if (active && profile && typeof profile === "object") {
          setForm({
            ...initialForm,
            ...profileToForm(profile),
            full_name:
              profile.full_name ?? user?.full_name ?? user?.name ?? "",
          });
        }
      } catch (err) {
        if (active) {
          setError(
            err?.message ||
              "We could not load your profile. You can still enter your details below."
          );
          setForm((current) => ({
            ...current,
            full_name: user?.full_name ?? user?.name ?? "",
          }));
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    loadProfile();

    return () => {
      active = false;
    };
  }, [user?.full_name, user?.name]);

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));

    setError("");
    setSuccess("");
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!form.full_name.trim()) {
      setError("Please enter your full name.");
      return;
    }

    setSaving(true);

    try {
      const payload = {
        full_name: form.full_name.trim(),
        headline: form.headline.trim(),
        bio: form.bio.trim(),
        location: form.location.trim(),
        phone: form.phone.trim(),
        career_interests: form.career_interests
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),
        linkedin_url: form.linkedin_url.trim(),
        portfolio_url: form.portfolio_url.trim(),
      };

      await candidateService.updateProfile(payload);

      if (typeof updateUser === "function") {
        updateUser({
          ...user,
          full_name: payload.full_name,
          name: payload.full_name,
        });
      }

      setSuccess("Your profile has been saved.");
    } catch (err) {
      setError(
        err?.message ||
          "We could not save your profile. Please try again."
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="dashboard-page candidate-profile-page">
      <header className="page-heading">
        <span className="section-heading__eyebrow">Your career profile</span>
        <h1>My profile</h1>
        <p>
          Share your background, skills and ambitions so employers can
          better understand what you offer.
        </p>
      </header>

      <div className="candidate-profile-page__navigation">
        <Link to="/candidate/dashboard">← Back to dashboard</Link>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : (
        <section className="dashboard-panel candidate-profile-panel">
          {error && <ErrorMessage message={error} />}

          {success && (
            <p className="form-success" role="status">
              {success}
            </p>
          )}

          <form className="profile-form" onSubmit={handleSubmit}>
            <div className="profile-form__section-heading">
              <h2>Personal information</h2>
              <p>Keep your contact details and location up to date.</p>
            </div>

            <FormField
              label="Full name"
              name="full_name"
              value={form.full_name}
              onChange={handleChange}
              placeholder="Your full name"
              autoComplete="name"
              required
              disabled={saving}
            />

            <FormField
              label="Professional headline"
              name="headline"
              value={form.headline}
              onChange={handleChange}
              placeholder="e.g. Junior Software Developer"
              disabled={saving}
              maxLength={150}
            />

            <FormField
              label="Professional summary"
              name="bio"
              type="textarea"
              value={form.bio}
              onChange={handleChange}
              placeholder="Describe your experience, strengths and career goals..."
              rows={5}
              disabled={saving}
              maxLength={2000}
            />

            <div className="profile-form__grid">
              <FormField
                label="Location"
                name="location"
                value={form.location}
                onChange={handleChange}
                placeholder="City or province"
                autoComplete="address-level2"
                disabled={saving}
              />

              <FormField
                label="Phone number"
                name="phone"
                type="tel"
                value={form.phone}
                onChange={handleChange}
                placeholder="Your contact number"
                autoComplete="tel"
                disabled={saving}
              />
            </div>

            <div className="profile-form__section-heading">
              <h2>Career interests</h2>
              <p>
                Add your interests separated by commas, such as software
                development, IT support or data analysis.
              </p>
            </div>

            <FormField
              label="Career interests"
              name="career_interests"
              value={form.career_interests}
              onChange={handleChange}
              placeholder="Software development, IT support, data analysis"
              disabled={saving}
            />

            <div className="profile-form__grid">
              <FormField
                label="LinkedIn profile URL"
                name="linkedin_url"
                type="url"
                value={form.linkedin_url}
                onChange={handleChange}
                placeholder="https://www.linkedin.com/in/..."
                disabled={saving}
              />

              <FormField
                label="Portfolio URL"
                name="portfolio_url"
                type="url"
                value={form.portfolio_url}
                onChange={handleChange}
                placeholder="https://your-portfolio.example"
                disabled={saving}
              />
            </div>

            <div className="profile-form__actions">
              <button
                type="submit"
                className="button button--primary"
                disabled={saving}
              >
                {saving ? "Saving profile..." : "Save profile"}
              </button>
            </div>
          </form>
        </section>
      )}
    </main>
  );
}
