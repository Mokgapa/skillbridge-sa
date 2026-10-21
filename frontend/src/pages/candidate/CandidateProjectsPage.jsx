
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  EmptyState,
  ErrorMessage,
  LoadingSpinner,
  SectionHeader,
} from '../../components';
import { projectService } from '../../services';

const initialForm = {
  title: '',
  description: '',
  technologies: '',
  project_url: '',
  repository_url: '',
  start_date: '',
  end_date: '',
};

export default function CandidateProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  async function loadProjects() {
    setLoading(true);
    setError('');

    try {
      const response = await projectService.getAll();
      const records = Array.isArray(response)
        ? response
        : response?.items ?? response?.projects ?? response?.data ?? [];

      setProjects(Array.isArray(records) ? records : []);
    } catch (err) {
      setError(err?.message || 'Unable to load your projects.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadProjects();
  }, []);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  function startEditing(project) {
    setEditingId(project.id ?? project.project_id);

    const technologies = Array.isArray(project.technologies)
      ? project.technologies.join(', ')
      : project.technologies ?? '';

    setForm({
      title: project.title ?? '',
      description: project.description ?? '',
      technologies,
      project_url: project.project_url ?? project.live_url ?? '',
      repository_url: project.repository_url ?? project.github_url ?? '',
      start_date: project.start_date?.slice(0, 10) ?? '',
      end_date: project.end_date?.slice(0, 10) ?? '',
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
      technologies: form.technologies
        .split(',')
        .map((technology) => technology.trim())
        .filter(Boolean),
      project_url: form.project_url || null,
      repository_url: form.repository_url || null,
      start_date: form.start_date || null,
      end_date: form.end_date || null,
    };

    try {
      if (editingId !== null) {
        await projectService.update(editingId, payload);
        setMessage('Project updated successfully.');
      } else {
        await projectService.create(payload);
        setMessage('Project added successfully.');
      }

      resetForm();
      await loadProjects();
    } catch (err) {
      setError(err?.message || 'Unable to save your project.');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Are you sure you want to delete this project?')) {
      return;
    }

    setError('');
    setMessage('');

    try {
      await projectService.delete(id);
      setMessage('Project deleted successfully.');

      if (editingId === id) {
        setForm(initialForm);
        setEditingId(null);
      }

      await loadProjects();
    } catch (err) {
      setError(err?.message || 'Unable to delete this project.');
    }
  }

  if (loading) {
    return <LoadingSpinner message="Loading your projects..." />;
  }

  return (
    <div className="page-container candidate-projects-page">
      <div className="page-heading">
        <div>
          <p className="eyebrow">SHOWCASE YOUR WORK</p>
          <h1>My projects</h1>
          <p className="page-description">
            Share projects that demonstrate your skills, creativity and
            practical experience.
          </p>
        </div>

        <Link to="/candidate" className="button button-secondary">
          Back to dashboard
        </Link>
      </div>

      {error && <ErrorMessage message={error} onRetry={loadProjects} />}

      {message && (
        <div className="alert alert-success" role="status">
          {message}
        </div>
      )}

      <section className="content-card">
        <SectionHeader
          title={editingId !== null ? 'Edit project' : 'Add a project'}
          description="Add a portfolio project, software application or other relevant work."
        />

        <form className="form-grid" onSubmit={handleSubmit}>
          <div className="form-group form-group-full">
            <label htmlFor="project-title">Project title *</label>
            <input
              id="project-title"
              name="title"
              className="form-input"
              value={form.title}
              onChange={handleChange}
              placeholder="e.g. Employee Management System"
              required
            />
          </div>

          <div className="form-group form-group-full">
            <label htmlFor="project-description">Description *</label>
            <textarea
              id="project-description"
              name="description"
              className="form-textarea"
              rows={5}
              value={form.description}
              onChange={handleChange}
              placeholder="Explain what the project does and what you contributed."
              required
            />
          </div>

          <div className="form-group form-group-full">
            <label htmlFor="project-technologies">
              Technologies used
            </label>
            <input
              id="project-technologies"
              name="technologies"
              className="form-input"
              value={form.technologies}
              onChange={handleChange}
              placeholder="e.g. Python, FastAPI, React, MySQL"
            />
            <p className="helper-text">
              Separate technologies with commas.
            </p>
          </div>

          <div className="form-group">
            <label htmlFor="project-live-url">Live project URL</label>
            <input
              id="project-live-url"
              name="project_url"
              type="url"
              className="form-input"
              value={form.project_url}
              onChange={handleChange}
              placeholder="https://..."
            />
          </div>

          <div className="form-group">
            <label htmlFor="project-repository-url">Source code URL</label>
            <input
              id="project-repository-url"
              name="repository_url"
              type="url"
              className="form-input"
              value={form.repository_url}
              onChange={handleChange}
              placeholder="https://github.com/..."
            />
          </div>

          <div className="form-group">
            <label htmlFor="project-start-date">Start date</label>
            <input
              id="project-start-date"
              name="start_date"
              type="date"
              className="form-input"
              value={form.start_date}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="project-end-date">End date</label>
            <input
              id="project-end-date"
              name="end_date"
              type="date"
              className="form-input"
              value={form.end_date}
              onChange={handleChange}
              min={form.start_date || undefined}
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
                  ? 'Update project'
                  : 'Add project'}
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
          title="Your portfolio"
          description={`${projects.length} project${projects.length === 1 ? '' : 's'} added`}
        />

        {projects.length === 0 ? (
          <EmptyState
            title="Your portfolio is waiting"
            description="Add a project to help employers understand what you can build and accomplish."
          />
        ) : (
          <div className="record-list">
            {projects.map((project) => {
              const id = project.id ?? project.project_id;
              const technologies = Array.isArray(project.technologies)
                ? project.technologies
                : typeof project.technologies === 'string'
                  ? project.technologies.split(',').map((item) => item.trim()).filter(Boolean)
                  : [];

              return (
                <article className="record-card" key={id}>
                  <div className="record-card-content">
                    <h3>{project.title}</h3>
                    <p>{project.description}</p>

                    {technologies.length > 0 && (
                      <div className="tag-list">
                        {technologies.map((technology) => (
                          <span className="technology-tag" key={technology}>
                            {technology}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="project-links">
                      {project.project_url && (
                        <a
                          href={project.project_url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-link"
                        >
                          View live project
                        </a>
                      )}

                      {(project.repository_url || project.github_url) && (
                        <a
                          href={project.repository_url || project.github_url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-link"
                        >
                          View source code
                        </a>
                      )}
                    </div>
                  </div>

                  <div className="record-actions">
                    <button
                      type="button"
                      className="button button-secondary button-small"
                      onClick={() => startEditing(project)}
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
