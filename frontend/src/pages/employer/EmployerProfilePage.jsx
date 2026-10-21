
import { useEffect, useState } from "react";
import { useAuth } from "../../hooks";
import { employerService } from "../../services";
import {
  ErrorMessage,
  LoadingSpinner,
  SectionHeader,
  FormField,
} from "../../components";

const initialForm = {
  company_name: "",
  industry: "",
  company_size: "",
  website: "",
  location: "",
  description: "",
  contact_email: "",
  contact_phone: "",
};

export default function EmployerProfilePage() {
  const { user, updateUser } = useAuth();

  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    loadProfile();
  }, []);

  async function loadProfile() {
    setLoading(true);
    setError("");

    try {
      const response = await employerService.getProfile();
      const profile = response?.data ?? response;

      setForm({
        company_name: profile.company_name || "",
        industry: profile.industry || "",
        company_size: profile.company_size || "",
        website: profile.website || "",
        location: profile.location || "",
        description: profile.description || "",
        contact_email: profile.contact_email || user?.email || "",
        contact_phone: profile.contact_phone || "",
      });
    } catch (err) {
      setError(
        err?.message ||
          "Unable to load your employer profile."
      );
    } finally {
      setLoading(false);
    }
  }

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    setSuccess("");
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!form.company_name.trim()) {
      setError("Please enter your company or organisation name.");
      return;
    }

    setSaving(true);

    try {
      const payload = {
        ...form,
        company_name: form.company_name.trim(),
        website: form.website.trim() || null,
        location: form.location.trim() || null,
        description: form.description.trim() || null,
        contact_email: form.contact_email.trim() || null,
        contact_phone: form.contact_phone.trim() || null,
        industry: form.industry.trim() || null,
        company_size: form.company_size || null,
      };

      const response = await employerService.updateProfile(payload);
      const updatedProfile = response?.data ?? response;

      updateUser({
        ...user,
        company_name:
          updatedProfile.company_name || payload.company_name,
      });

      setSuccess("Your employer profile has been updated.");
    } catch (err) {
      setError(
        err?.message ||
          "Unable to save your employer profile."
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <LoadingSpinner message="Loading employer profile..." />;
  }

  return (
    <div className="page-container employer-profile-page">
      <SectionHeader
        title="Company Profile"
        subtitle="Keep your organisation details accurate so candidates can learn about your company."
      />

      {error && <ErrorMessage message={error} onRetry={loadProfile} />}

      {success && (
        <div className="alert alert-success" role="status">
          {success}
        </div>
      )}

      <form className="card form-card" onSubmit={handleSubmit}>
        <FormField
          label="Company or organisation name"
          name="company_name"
          value={form.company_name}
          onChange={handleChange}
          required
        />

        <div className="form-grid">
          <FormField
            label="Industry"
            name="industry"
            value={form.industry}
            onChange={handleChange}
            placeholder="e.g. Information Technology"
          />

          <FormField
            label="Company size"
            name="company_size"
            type="select"
            value={form.company_size}
            onChange={handleChange}
            options={[
              { value: "", label: "Select company size" },
              { value: "1-10", label: "1–10 employees" },
              { value: "11-50", label: "11–50 employees" },
              { value: "51-200", label: "51–200 employees" },
              { value: "201-500", label: "201–500 employees" },
              { value: "500+", label: "500+ employees" },
            ]}
          />
        </div>

        <FormField
          label="Company website"
          name="website"
          type="url"
          value={form.website}
          onChange={handleChange}
          placeholder="https://example.com"
        />

        <FormField
          label="Location"
          name="location"
          value={form.location}
          onChange={handleChange}
          placeholder="e.g. Johannesburg, South Africa"
        />

        <FormField
          label="Company description"
          name="description"
          type="textarea"
          value={form.description}
          onChange={handleChange}
          placeholder="Tell candidates about your organisation."
        />

        <div className="form-grid">
          <FormField
            label="Contact email"
            name="contact_email"
            type="email"
            value={form.contact_email}
            onChange={handleChange}
          />

          <FormField
            label="Contact phone"
            name="contact_phone"
            type="tel"
            value={form.contact_phone}
            onChange={handleChange}
          />
        </div>

        <div className="form-actions">
          <button
            type="submit"
            className="btn btn-primary"
            disabled={saving}
          >
            {saving ? "Saving..." : "Save company profile"}
          </button>
        </div>
      </form>
    </div>
  );
}
