
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  EmptyState,
  ErrorMessage,
  LoadingSpinner,
  SectionHeader,
} from '../../components';
import { certificateService } from '../../services';

const initialForm = {
  name: '',
  issuing_organization: '',
  issue_date: '',
  expiry_date: '',
  credential_id: '',
  credential_url: '',
  description: '',
};

export default function CandidateCertificatesPage() {
  const [certificates, setCertificates] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  async function loadCertificates() {
    setLoading(true);
    setError('');

    try {
      const response = await certificateService.getAll();
      const records = Array.isArray(response)
        ? response
        : response?.items ??
          response?.certificates ??
          response?.data ??
          [];

      setCertificates(Array.isArray(records) ? records : []);
    } catch (err) {
      setError(err?.message || 'Unable to load your certificates.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCertificates();
  }, []);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  function startEditing(certificate) {
    setEditingId(certificate.id ?? certificate.certificate_id);

    setForm({
      name: certificate.name ?? '',
      issuing_organization: certificate.issuing_organization ?? '',
      issue_date: certificate.issue_date?.slice(0, 10) ?? '',
      expiry_date: certificate.expiry_date?.slice(0, 10) ?? '',
      credential_id: certificate.credential_id ?? '',
      credential_url: certificate.credential_url ?? '',
      description: certificate.description ?? '',
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

    try {
      const payload = {
        ...form,
        issue_date: form.issue_date || null,
        expiry_date: form.expiry_date || null,
        credential_id: form.credential_id || null,
        credential_url: form.credential_url || null,
        description: form.description || null,
      };

      if (editingId !== null) {
        await certificateService.update(editingId, payload);
        setMessage('Certificate updated successfully.');
      } else {
        await certificateService.create(payload);
        setMessage('Certificate added successfully.');
      }

      resetForm();
      await loadCertificates();
    } catch (err) {
      setError(err?.message || 'Unable to save this certificate.');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Are you sure you want to delete this certificate?')) {
      return;
    }

    setError('');
    setMessage('');

    try {
      await certificateService.delete(id);
      setMessage('Certificate deleted successfully.');

      if (editingId === id) {
        setForm(initialForm);
        setEditingId(null);
      }

      await loadCertificates();
    } catch (err) {
      setError(err?.message || 'Unable to delete this certificate.');
    }
  }

  if (loading) {
    return <LoadingSpinner message="Loading your certificates..." />;
  }

  return (
    <div className="page-container candidate-certificates-page">
      <div className="page-heading">
        <div>
          <p className="eyebrow">PROOF OF YOUR ACHIEVEMENTS</p>
          <h1>My certificates</h1>
          <p className="page-description">
            Record your professional certificates, completed courses and other
            relevant credentials.
          </p>
        </div>

        <Link to="/candidate" className="button button-secondary">
          Back to dashboard
        </Link>
      </div>

      {error && <ErrorMessage message={error} onRetry={loadCertificates} />}

      {message && (
        <div className="alert alert-success" role="status">
          {message}
        </div>
      )}

      <section className="content-card">
        <SectionHeader
          title={editingId !== null ? 'Edit certificate' : 'Add a certificate'}
          description="Enter the details shown on your certificate or credential."
        />

        <form className="form-grid" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="certificate-name">Certificate name *</label>
            <input
              id="certificate-name"
              name="name"
              className="form-input"
              value={form.name}
              onChange={handleChange}
              placeholder="e.g. Junior Software Developer"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="issuing-organization">Issuing organization *</label>
            <input
              id="issuing-organization"
              name="issuing_organization"
              className="form-input"
              value={form.issuing_organization}
              onChange={handleChange}
              placeholder="e.g. Amazon or Coursera"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="issue-date">Issue date</label>
            <input
              id="issue-date"
              name="issue_date"
              type="date"
              className="form-input"
              value={form.issue_date}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="expiry-date">Expiry date</label>
            <input
              id="expiry-date"
              name="expiry_date"
              type="date"
              className="form-input"
              value={form.expiry_date}
              onChange={handleChange}
              min={form.issue_date || undefined}
            />
          </div>

          <div className="form-group">
            <label htmlFor="credential-id">Credential ID</label>
            <input
              id="credential-id"
              name="credential_id"
              className="form-input"
              value={form.credential_id}
              onChange={handleChange}
              placeholder="Optional credential number"
            />
          </div>

          <div className="form-group">
            <label htmlFor="credential-url">Credential URL</label>
            <input
              id="credential-url"
              name="credential_url"
              type="url"
              className="form-input"
              value={form.credential_url}
              onChange={handleChange}
              placeholder="https://..."
            />
          </div>

          <div className="form-group form-group-full">
            <label htmlFor="certificate-description">Description</label>
            <textarea
              id="certificate-description"
              name="description"
              className="form-textarea"
              rows={4}
              value={form.description}
              onChange={handleChange}
              placeholder="Add relevant skills or details covered by this certificate."
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
                  ? 'Update certificate'
                  : 'Add certificate'}
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
          title="Your certificates"
          description={`${certificates.length} certificate${certificates.length === 1 ? '' : 's'} recorded`}
        />

        {certificates.length === 0 ? (
          <EmptyState
            title="No certificates added yet"
            description="Add completed courses and certificates to showcase your achievements to employers."
          />
        ) : (
          <div className="record-list">
            {certificates.map((certificate) => {
              const id = certificate.id ?? certificate.certificate_id;

              return (
                <article className="record-card" key={id}>
                  <div className="record-card-content">
                    <h3>{certificate.name}</h3>
                    <p className="record-subtitle">
                      {certificate.issuing_organization}
                    </p>

                    {certificate.issue_date && (
                      <p className="record-meta">
                        Issued: {certificate.issue_date.slice(0, 10)}
                        {certificate.expiry_date
                          ? ` · Expires: ${certificate.expiry_date.slice(0, 10)}`
                          : ''}
                      </p>
                    )}

                    {certificate.credential_id && (
                      <p>Credential ID: {certificate.credential_id}</p>
                    )}

                    {certificate.description && (
                      <p>{certificate.description}</p>
                    )}

                    {certificate.credential_url && (
                      <a
                        href={certificate.credential_url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-link"
                      >
                        View credential
                      </a>
                    )}
                  </div>

                  <div className="record-actions">
                    <button
                      type="button"
                      className="button button-secondary button-small"
                      onClick={() => startEditing(certificate)}
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
