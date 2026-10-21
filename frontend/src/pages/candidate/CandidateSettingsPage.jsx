
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ErrorMessage, SectionHeader } from '../../components';
import { useAuth } from '../../hooks';

export default function CandidateSettingsPage() {
  const { user, updateUser, logout } = useAuth();

  const [form, setForm] = useState({
    emailNotifications: user?.email_notifications ?? true,
    opportunityAlerts: user?.opportunity_alerts ?? true,
    mentorshipUpdates: user?.mentorship_updates ?? true,
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  function handleChange(event) {
    const { name, checked } = event.target;

    setForm((current) => ({
      ...current,
      [name]: checked,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setMessage('');
    setSaving(true);

    try {
      const preferences = {
        email_notifications: form.emailNotifications,
        opportunity_alerts: form.opportunityAlerts,
        mentorship_updates: form.mentorshipUpdates,
      };

      if (typeof updateUser === 'function') {
        await updateUser(preferences);
      }

      setMessage(
        'Your preferences have been saved for this session. Permanent notification settings will be available when supported by the account API.'
      );
    } catch (err) {
      setError(err?.message || 'Unable to save your preferences.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="page-container candidate-settings-page">
      <div className="page-heading">
        <div>
          <p className="eyebrow">YOUR ACCOUNT</p>
          <h1>Settings</h1>
          <p className="page-description">
            Manage your notification preferences and account access.
          </p>
        </div>

        <Link to="/candidate" className="button button-secondary">
          Back to dashboard
        </Link>
      </div>

      {error && <ErrorMessage message={error} />}

      {message && (
        <div className="alert alert-success" role="status">
          {message}
        </div>
      )}

      <section className="content-card">
        <SectionHeader
          title="Notification preferences"
          description="Choose which updates you would like to receive."
        />

        <form onSubmit={handleSubmit}>
          <div className="settings-list">
            <label className="settings-option">
              <span>
                <strong>Email notifications</strong>
                <small>Receive important account updates by email.</small>
              </span>
              <input
                type="checkbox"
                name="emailNotifications"
                checked={form.emailNotifications}
                onChange={handleChange}
              />
            </label>

            <label className="settings-option">
              <span>
                <strong>Opportunity alerts</strong>
                <small>Stay informed about relevant jobs and internships.</small>
              </span>
              <input
                type="checkbox"
                name="opportunityAlerts"
                checked={form.opportunityAlerts}
                onChange={handleChange}
              />
            </label>

            <label className="settings-option">
              <span>
                <strong>Mentorship updates</strong>
                <small>Receive updates about mentorship requests.</small>
              </span>
              <input
                type="checkbox"
                name="mentorshipUpdates"
                checked={form.mentorshipUpdates}
                onChange={handleChange}
              />
            </label>
          </div>

          <button
            type="submit"
            className="button button-primary"
            disabled={saving}
          >
            {saving ? 'Saving...' : 'Save preferences'}
          </button>
        </form>
      </section>

      <section className="content-card danger-zone">
        <SectionHeader
          title="Account access"
          description="Sign out when you are finished using SkillBridge SA."
        />

        <button
          type="button"
          className="button button-danger"
          onClick={logout}
        >
          Sign out
        </button>
      </section>
    </div>
  );
}
