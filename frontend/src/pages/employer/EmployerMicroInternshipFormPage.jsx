
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { microInternshipService } from "../../services";
import {
  ErrorMessage,
  LoadingSpinner,
  SectionHeader,
  FormField,
} from "../../components";

const initialForm = {
  title: "",
  description: "",
  category: "",
  location: "",
  duration: "",
  stipend: "",
  required_skills: "",
  application_deadline: "",
};

export default function EmployerMicroInternshipFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isEditing) loadInternship();
  }, [id]);

  async function loadInternship() {
    setLoading(true);
    setError("");

    try {
      const response = await microInternshipService.getById(id);
      const internship = response?.data ?? response;

      setForm({
        title: internship.title || "",
        description: internship.description || "",
        category: internship.category || "",
        location: internship.location || "",
        duration: internship.duration || "",
        stipend: internship.stipend ?? "",
        required_skills: Array.isArray(internship.required_skills)
          ? internship.required_skills.join(", ")
          : internship.required_skills || "",
        application_deadline: internship.application_deadline
          ? String(internship.application_deadline).slice(0, 10)
          : "",
      });
    } catch (err) {
      setError(
        err?.message || "Unable to load this micro-internship."
      );
    } finally {
      setLoading(false);
    }
  }

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (!form.title.trim() || !form.description.trim()) {
      setError("Please enter a project title and description.");
      return;
    }

    if (form.stipend !== "" && Number(form.stipend) < 0) {
      setError("The stipend cannot be negative.");
      return;
    }

    const payload = {
      ...form,
      title: form.title.trim(),
      description: form.description.trim(),
      category: form.category.trim() || null,
      location: form.location.trim() || null,
      duration: form.duration.trim() || null,
      stipend: form.stipend === "" ? null : Number(form.stipend),
      application_deadline: form.application_deadline || null,
      required_skills: form.required_skills
        .split(",")
        .map((skill) => skill.trim())
        .filter(Boolean),
    };

    setSaving(true);

    try {
      if (isEditing) {
        await microInternshipService.update(id, payload);
      } else {
        await microInternshipService.create(payload);
      }

      navigate("/employer/micro-internships", { replace: true });
    } catch (err) {
      setError(
        err?.message || "Unable to save this micro-internship."
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <LoadingSpinner message="Loading project details..." />;
  }

  return (
    <div className="page-container employer-micro-internship-form-page">
      <SectionHeader
        title={
          isEditing
            ? "Edit Micro-Internship"
            : "Create Micro-Internship"
        }
        subtitle="Define a practical, short-term project that candidates can apply to."
      />

      {error && <ErrorMessage message={error} />}

      <form className="card form-card" onSubmit={handleSubmit}>
        <FormField
          label="Project title"
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="e.g. Build a simple business website"
          required
        />

        <FormField
          label="Project description"
          name="description"
          type="textarea"
          value={form.description}
          onChange={handleChange}
          placeholder="Explain the project, tasks and expected deliverables."
          required
        />

        <div className="form-grid">
          <FormField
            label="Category"
            name="category"
            value={form.category}
            onChange={handleChange}
            placeholder="e.g. Software Development"
          />

          <FormField
            label="Location"
            name="location"
            value={form.location}
            onChange={handleChange}
            placeholder="e.g. Remote or Johannesburg"
          />
        </div>

        <div className="form-grid">
          <FormField
            label="Duration"
            name="duration"
            value={form.duration}
            onChange={handleChange}
            placeholder="e.g. 2 weeks"
          />

          <FormField
            label="Stipend (ZAR)"
            name="stipend"
            type="number"
            value={form.stipend}
            onChange={handleChange}
            placeholder="Optional"
            min="0"
          />
        </div>

        <FormField
          label="Required skills"
          name="required_skills"
          value={form.required_skills}
          onChange={handleChange}
          placeholder="HTML, CSS, communication"
          helpText="Separate skills with commas."
        />

        <FormField
          label="Application deadline"
          name="application_deadline"
          type="date"
          value={form.application_deadline}
          onChange={handleChange}
        />

        <div className="form-actions">
          <Link
            to="/employer/micro-internships"
            className="btn btn-outline"
          >
            Cancel
          </Link>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={saving}
          >
            {saving
              ? "Saving..."
              : isEditing
                ? "Save changes"
                : "Publish project"}
          </button>
        </div>
      </form>
    </div>
  );
}
