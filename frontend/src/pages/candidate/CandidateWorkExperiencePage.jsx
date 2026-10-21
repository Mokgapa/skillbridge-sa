
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  EmptyState,
  ErrorMessage,
  LoadingSpinner,
  SectionHeader,
} from '../../components';
import { workExperienceService } from '../../services';

const initialForm = {
  company_name: '',
  job_title: '',
  employment_type: '',
  location: '',
  start_date: '',
  end_date: '',
  is_current: false,
  description: '',
};

export default function CandidateWorkExperiencePage() {
  const [experiences, setExperiences] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  async function loadExperiences() {
    setLoading(true);
    setError('');

    try {
      const response = await workExperienceService.getAll();
      const records = Array.isArray(response)
        ? response
        : response?.items ?? response?.experiences ?? response?.data ?? [];

      setExperiences(Array.isArray(records) ? records : []);
    } catch (err) {
      setError(err?.message || 'Unable to load your work experience.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadExperiences();
  }, []);

  function handleChange(event) {
    const { name, value, type, checked } = event.target;

    setForm((current) => ({
      ...current,
      [name]: type === 'checkbox' ? checked : value,
      ...(name === 'is_current' && checked ? { end_date: '' } : {}),
    }));
  }

  function startEditing(experience) {
    setEditingId(experience.id ?? experience.experience_id);

    setForm({
      company_name: experience.company_name ?? experience.company ?? '',
      job_title: experience.job_title ?? experience.position ?? '',
      employment_type: experience.employment_type ?? '',
      location: experience.location ?? '',
      start_date: experience.start_date?.slice(0, 10) ?? '',
      end_date: experience.end_date?.slice(0, 10) ?? '',
      is_current: Boolean(experience.is_current),
      description: experience.description ?? '',
    });

    setError('');
    setMessage('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function resetForm() {
    setForm(initialForm);
    setEditingId(null);
    setError('');
    setMessage('');
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSaving(true);
    setError('');
    setMessage('');

    const payload = {
      ...form,
      end_date: form.is_current || !form.end_date ? null : form.end_date,
    };

    try {
      if (editingId !== null) {
        await workExperienceService.update(editingId, payload);
        setMessage('Work experience updated successfully.');
      } else {
        await workExperienceService.create(payload);
        setMessage('Work experience added successfully.');
      }

      resetForm();
      await loadExperiences();
    } catch (err) {
      setError(err?.message || 'Unable to save your work experience.');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Are you sure you want to delete this work experience?')) {
      return;
    }

    setError('');
    setMessage('');

    try {
      await workExperienceService.delete(id);
      setMessage('Work experience deleted successfully.');

      if (editingId === id) {
        setForm(initialForm);
        setEditingId(null);
      }

      await loadExperiences();
    } catch (err) {
      setError(err?.message || 'Unable to delete this work experience.');
    }
  }

  if (loading) {
    return <LoadingSpinner message="Loading your work experience..." />;
  }

  return (
    <div className="page-container candidate-experience-page">
      <div className="page-heading">
        <div>
          <p className="eyebrow">YOUR PROFESSIONAL JOURNEY</p>
          <h1>Work experience</h1>
          <p className="page-description">
            Highlight your previous roles, responsibilities and transferable
            skills for potential employers.
          </p>
        </div>

        <Link to="/candidate" className="button button-secondary">
          Back to dashboard
        </Link>
      </div>

      {error && <ErrorMessage message={error} onRetry={loadExperiences} />}

      {message && (
        <div className="alert alert-success" role="status">
          {message}
        </div>
      )}

      <section className="content-card">
        <SectionHeader
          title={editingId !== null ? 'Edit experience' : 'Add experience'}
          description="Include formal employment, contract work and other relevant experience."
        />

        <form className="form-grid" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="job-title">Job title *</label>
            <input
              id="job-title"
              name="job_title"
              className="form-input"
              value={form.job_title}
              onChange={handleChange}
              placeholder="e.g. Call Centre Agent"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="company-name">Company or employer *</label>
            <input
              id="company-name"
              name="company_name"
              className="form-input"
              value={form.company_name}
              onChange={handleChange}
              placeholder="e.g. FNB"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="employment-type">Employment type</label>
            <select
              id="employment-type"
              name="employment_type"
              className="form-select"
              value={form.employment_type}
              onChange={handleChange}
            >
              <option value="">Select type</option>
              <option value="full_time">Full-time</option>
              <option value="part_time">Part-time</option>
              <option value="contract">Contract</option>
              <option value="temporary">Temporary</option>
              <option value="internship">Internship</option>
              <option value="learnership">Learnership</option>
              <option value="freelance">Freelance</option>
              <option value="self_employed">Self-employed</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="experience-location">Location</label>
            <input
              id="experience-location"
              name="location"
              className="form-input"
              value={form.location}
              onChange={handleChange}
              placeholder="e.g. Johannesburg, South Africa"
            />
          </div>

          <div className="form-group">
            <label htmlFor="experience-start-date">Start date</label>
            <input
              id="experience-start-date"
              name="start_date"
              type="date"
              className="form-input"
              value={form.start_date}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="experience-end-date">End date</label>
            <input
              id="experience-end-date"
              name="end_date"
              type="date"
              className="form-input"
              value={form.end_date}
              onChange={handleChange}
              disabled={form.is_current}
              min={form.start_date || undefined}
            />
          </div>

          <label className="checkbox-field">
            <input
              type="checkbox"
              name="is_current"
              checked={form.is_current}
              onChange={handleChange}
            />
            I currently work here
          </label>

          <div className="form-group form-group-full">
            <label htmlFor="experience-description">Responsibilities and achievements</label>
            <textarea
              id="experience-description"
              name="description"
              className="form-textarea"
              rows={5}
              value={form.description}
              onChange={handleChange}
              placeholder="Describe your duties, achievements and skills used."
            />
          </div>

          <div className="form-actions form-group-full">
            <button
              type="submit"
              className="button button-primary"
              disabled={saving}
            >
              {saving
                ? 'Saving...'
                : editingId !== null
                  ? 'Update experience'
                  : 'Add experience'}
            </button>

            {editingId !== null && (
              <button
                type="button"
                className="button button-secondary"
                onClick={resetForm}
                disabled={saving}
              >
                Cancel editing
              </button>
            )}
          </div>
        </form>
      </section>

      <section className="content-card">
        <SectionHeader
          title="Your experience"
          description={`${experiences.length} work experience record${experiences.length === 1 ? '' : 's'}`}
        />

        {experiences.length === 0 ? (
          <EmptyState
            title="No work experience added yet"
            description="Add previous employment or relevant experience. You can also include contract roles and internships."
          />
        ) : (
          <div className="record-list">
            {experiences.map((experience) => {
              const id = experience.id ?? experience.experience_id;

              return (
                <article className="record-card" key={id}>
                  <div className="record-card-content">
                    <h3>
                      {experience.job_title ?? experience.position}
                    </h3>
                    <p className="record-subtitle">
                      {experience.company_name ?? experience.company}
                    </p>

                    {experience.location && <p>{experience.location}</p>}

                    <p className="record-meta">
                      {experience.start_date?.slice(0, 10) || 'Start date not set'}
                      {' — '}
                      {experience.is_current
                        ? 'Present'
                        : experience.end_date?.slice(0, 10) || 'End date not set'}
                    </p>

                    {experience.description && <p>{experience.description}</p>}
                  </div>

                  <div className="record-actions">
                    <button
                      type="button"
                      className="button button-secondary button-small"
                      onClick={() => startEditing(experience)}
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      className="button button-danger button-small"
                      onClick={() => handleDelete(id)}
                    >
                      Delete
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
