
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  EmptyState,
  ErrorMessage,
  LoadingSpinner,
  SectionHeader,
} from '../../components';
import { educationService } from '../../services';

const initialForm = {
  institution: '',
  qualification: '',
  field_of_study: '',
  education_level: '',
  start_date: '',
  end_date: '',
  is_current: false,
  description: '',
};

export default function CandidateEducationPage() {
  const [education, setEducation] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  async function loadEducation() {
    setLoading(true);
    setError('');

    try {
      const response = await educationService.getAll();
      const records = Array.isArray(response)
        ? response
        : response?.items ?? response?.education ?? response?.data ?? [];

      setEducation(Array.isArray(records) ? records : []);
    } catch (err) {
      setError(err?.message || 'Unable to load education history.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadEducation();
  }, []);

  function handleChange(event) {
    const { name, value, type, checked } = event.target;

    setForm((current) => ({
      ...current,
      [name]: type === 'checkbox' ? checked : value,
      ...(name === 'is_current' && checked ? { end_date: '' } : {}),
    }));
  }

  function startEditing(record) {
    setEditingId(record.id ?? record.education_id);

    setForm({
      institution: record.institution ?? '',
      qualification: record.qualification ?? '',
      field_of_study: record.field_of_study ?? '',
      education_level: record.education_level ?? '',
      start_date: record.start_date?.slice(0, 10) ?? '',
      end_date: record.end_date?.slice(0, 10) ?? '',
      is_current: Boolean(record.is_current),
      description: record.description ?? '',
    });

    setMessage('');
    setError('');
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
        await educationService.update(editingId, payload);
        setMessage('Education record updated successfully.');
      } else {
        await educationService.create(payload);
        setMessage('Education record added successfully.');
      }

      resetForm();
      await loadEducation();
    } catch (err) {
      setError(err?.message || 'Unable to save your education record.');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    const confirmed = window.confirm(
      'Are you sure you want to delete this education record?'
    );

    if (!confirmed) return;

    setError('');
    setMessage('');

    try {
      await educationService.delete(id);
      setMessage('Education record deleted successfully.');

      if (editingId === id) resetForm();

      await loadEducation();
    } catch (err) {
      setError(err?.message || 'Unable to delete this education record.');
    }
  }

  if (loading) {
    return <LoadingSpinner message="Loading your education history..." />;
  }

  return (
    <div className="page-container candidate-education-page">
      <div className="page-heading">
        <div>
          <p className="eyebrow">YOUR QUALIFICATIONS</p>
          <h1>Education history</h1>
          <p className="page-description">
            Add your qualifications and studies to strengthen your candidate
            profile.
          </p>
        </div>

        <Link to="/candidate" className="button button-secondary">
          Back to dashboard
        </Link>
      </div>

      {error && <ErrorMessage message={error} onRetry={loadEducation} />}

      {message && (
        <div className="alert alert-success" role="status">
          {message}
        </div>
      )}

      <section className="content-card">
        <SectionHeader
          title={editingId !== null ? 'Edit education' : 'Add education'}
          description="Provide accurate details about your studies."
        />

        <form className="form-grid" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="institution">Institution *</label>
            <input
              id="institution"
              name="institution"
              className="form-input"
              value={form.institution}
              onChange={handleChange}
              placeholder="e.g. CTU Training Solutions"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="qualification">Qualification *</label>
            <input
              id="qualification"
              name="qualification"
              className="form-input"
              value={form.qualification}
              onChange={handleChange}
              placeholder="e.g. National Certificate"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="field_of_study">Field of study</label>
            <input
              id="field_of_study"
              name="field_of_study"
              className="form-input"
              value={form.field_of_study}
              onChange={handleChange}
              placeholder="e.g. System Development"
            />
          </div>

          <div className="form-group">
            <label htmlFor="education_level">Education level</label>
            <select
              id="education_level"
              name="education_level"
              className="form-select"
              value={form.education_level}
              onChange={handleChange}
            >
              <option value="">Select level</option>
              <option value="high_school">High school / Matric</option>
              <option value="certificate">Certificate</option>
              <option value="higher_certificate">Higher certificate</option>
              <option value="diploma">Diploma</option>
              <option value="advanced_diploma">Advanced diploma</option>
              <option value="bachelors">Bachelor's degree</option>
              <option value="honours">Honours degree</option>
              <option value="masters">Master's degree</option>
              <option value="doctorate">Doctorate</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="start_date">Start date</label>
            <input
              id="start_date"
              name="start_date"
              type="date"
              className="form-input"
              value={form.start_date}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="end_date">End date</label>
            <input
              id="end_date"
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
            I am currently studying here
          </label>

          <div className="form-group form-group-full">
            <label htmlFor="description">Additional details</label>
            <textarea
              id="description"
              name="description"
              className="form-textarea"
              rows={4}
              value={form.description}
              onChange={handleChange}
              placeholder="Relevant subjects, achievements or coursework"
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
                  ? 'Update education'
                  : 'Add education'}
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
          title="Your qualifications"
          description={`${education.length} education record${education.length === 1 ? '' : 's'}`}
        />

        {education.length === 0 ? (
          <EmptyState
            title="No education records yet"
            description="Add your qualifications so employers can better understand your background."
          />
        ) : (
          <div className="record-list">
            {education.map((record) => {
              const id = record.id ?? record.education_id;

              return (
                <article className="record-card" key={id}>
                  <div className="record-card-content">
                    <h3>{record.qualification}</h3>
                    <p className="record-subtitle">
                      {record.institution}
                    </p>

                    {record.field_of_study && (
                      <p>{record.field_of_study}</p>
                    )}

                    <p className="record-meta">
                      {record.start_date?.slice(0, 10) || 'Start date not set'}
                      {' — '}
                      {record.is_current
                        ? 'Present'
                        : record.end_date?.slice(0, 10) || 'End date not set'}
                    </p>

                    {record.description && <p>{record.description}</p>}
                  </div>

                  <div className="record-actions">
                    <button
                      type="button"
                      className="button button-secondary button-small"
                      onClick={() => startEditing(record)}
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
