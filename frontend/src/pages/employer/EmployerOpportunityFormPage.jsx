
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { opportunityService } from "../../services";
import {
  ErrorMessage,
  LoadingSpinner,
  SectionHeader,
  FormField,
} from "../../components";

const initialForm = {
  title: "",
  description: "",
  employment_type: "full_time",
  workplace_type: "onsite",
  location: "",
  salary_min: "",
  salary_max: "",
  application_deadline: "",
  required_skills: "",
};

export default function EmployerOpportunityFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isEditing) loadOpportunity();
  }, [id]);

  async function loadOpportunity() {
    setLoading(true);
    setError("");

    try {
      const response = await opportunityService.getById(id);
      const opportunity = response?.data ?? response;

      setForm({
        title: opportunity.title || "",
        description: opportunity.description || "",
        employment_type: opportunity.employment_type || "full_time",
        workplace_type: opportunity.workplace_type || "onsite",
        location: opportunity.location || "",
        salary_min: opportunity.salary_min ?? "",
        salary_max: opportunity.salary_max ?? "",
        application_deadline: opportunity.application_deadline
          ? String(opportunity.application_deadline).slice(0, 10)
          : "",
        required_skills: Array.isArray(opportunity.required_skills)
          ? opportunity.required_skills.join(", ")
          : opportunity.required_skills || "",
      });
    } catch (err) {
      setError(
        err?.message || "Unable to load this opportunity."
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
      setError("Please enter an opportunity title and description.");
      return;
    }

    if (
      form.salary_min !== "" &&
      form.salary_max !== "" &&
      Number(form.salary_min) > Number(form.salary_max)
    ) {
      setError("Minimum salary cannot exceed maximum salary.");
      return;
    }

    const payload = {
      ...form,
      title: form.title.trim(),
      description: form.description.trim(),
      salary_min:
        form.salary_min === "" ? null : Number(form.salary_min),
      salary_max:
        form.salary_max === "" ? null : Number(form.salary_max),
      application_deadline: form.application_deadline || null,
      required_skills: form.required_skills
        .split(",")
        .map((skill) => skill.trim())
        .filter(Boolean),
    };

    setSaving(true);

    try {
      if (isEditing) {
        await opportunityService.update(id, payload);
      } else {
        await opportunityService.create(payload);
      }

      navigate("/employer/opportunities", {
        replace: true,
        state: {
          message: isEditing
            ? "Opportunity updated successfully."
            : "Opportunity created successfully.",
        },
      });
    } catch (err) {
      setError(
        err?.message || "Unable to save the opportunity."
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <LoadingSpinner message="Loading opportunity..." />;
  }

  return (
    <div className="page-container employer-opportunity-form-page">
      <SectionHeader
        title={isEditing ? "Edit Opportunity" : "Create Opportunity"}
        subtitle={
          isEditing
            ? "Update the details of your opportunity."
            : "Share a job, internship or other opportunity with candidates."
        }
      />

      {error && <ErrorMessage message={error} />}

      <form className="card form-card" onSubmit={handleSubmit}>
        <FormField
          label="Opportunity title"
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="e.g. Junior Software Developer"
          required
        />

        <FormField
          label="Description"
          name="description"
          type="textarea"
          value={form.description}
          onChange={handleChange}
          placeholder="Describe the opportunity and responsibilities."
          required
        />

        <div className="form-grid">
          <FormField
            label="Employment type"
            name="employment_type"
            type="select"
            value={form.employment_type}
            onChange={handleChange}
            options={[
              { value: "full_time", label: "Full-time" },
              { value: "part_time", label: "Part-time" },
              { value: "contract", label: "Contract" },
              { value: "internship", label: "Internship" },
              { value: "learnership", label: "Learnership" },
              { value: "temporary", label: "Temporary" },
            ]}
            required
          />

          <FormField
            label="Workplace type"
            name="workplace_type"
            type="select"
            value={form.workplace_type}
            onChange={handleChange}
            options={[
              { value: "onsite", label: "On-site" },
              { value: "remote", label: "Remote" },
              { value: "hybrid", label: "Hybrid" },
            ]}
            required
          />
        </div>

        <FormField
          label="Location"
          name="location"
          value={form.location}
          onChange={handleChange}
          placeholder="e.g. Johannesburg or South Africa"
        />

        <div className="form-grid">
          <FormField
            label="Minimum salary (ZAR)"
            name="salary_min"
            type="number"
            value={form.salary_min}
            onChange={handleChange}
            placeholder="Optional"
            min="0"
          />

          <FormField
            label="Maximum salary (ZAR)"
            name="salary_max"
            type="number"
            value={form.salary_max}
            onChange={handleChange}
            placeholder="Optional"
            min="0"
          />
        </div>

        <FormField
          label="Application deadline"
          name="application_deadline"
          type="date"
          value={form.application_deadline}
          onChange={handleChange}
        />

        <FormField
          label="Required skills"
          name="required_skills"
          value={form.required_skills}
          onChange={handleChange}
          placeholder="Python, SQL, communication"
          helpText="Separate skills with commas."
        />

        <div className="form-actions">
          <Link
            to="/employer/opportunities"
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
                : "Publish opportunity"}
          </button>
        </div>
      </form>
    </div>
  );
}
