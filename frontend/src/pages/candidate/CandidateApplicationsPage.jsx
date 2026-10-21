
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ApplicationCard,
  EmptyState,
  ErrorMessage,
  LoadingSpinner,
  SectionHeader,
} from '../../components';
import { applicationService } from '../../services';

export default function CandidateApplicationsPage() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  async function loadApplications() {
    setLoading(true);
    setError('');

    try {
      const response = await applicationService.getMyApplications();
      const records = Array.isArray(response)
        ? response
        : response?.items ?? response?.applications ?? response?.data ?? [];

      setApplications(Array.isArray(records) ? records : []);
    } catch (err) {
      setError(
        err?.message ||
          'Unable to load your applications. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadApplications();
  }, []);

  const filteredApplications =
    statusFilter === 'all'
      ? applications
      : applications.filter(
          (application) =>
            String(application.status || '').toLowerCase() === statusFilter
        );

  const statuses = [
    { value: 'all', label: 'All applications' },
    { value: 'pending', label: 'Pending' },
    { value: 'reviewing', label: 'Reviewing' },
    { value: 'shortlisted', label: 'Shortlisted' },
    { value: 'accepted', label: 'Accepted' },
    { value: 'rejected', label: 'Rejected' },
  ];

  return (
    <div className="page-container candidate-applications-page">
      <div className="page-heading">
        <div>
          <p className="eyebrow">YOUR CAREER JOURNEY</p>
          <h1>My applications</h1>
          <p className="page-description">
            Track your applications and stay updated on your opportunities.
          </p>
        </div>

        <Link to="/opportunities" className="button button-primary">
          Find opportunities
        </Link>
      </div>

      <div className="application-summary">
        <div className="summary-card">
          <span>Total applications</span>
          <strong>{applications.length}</strong>
        </div>

        <div className="summary-card">
          <span>Pending</span>
          <strong>
            {
              applications.filter(
                (item) =>
                  String(item.status || '').toLowerCase() === 'pending'
              ).length
            }
          </strong>
        </div>

        <div className="summary-card">
          <span>Shortlisted</span>
          <strong>
            {
              applications.filter(
                (item) =>
                  String(item.status || '').toLowerCase() === 'shortlisted'
              ).length
            }
          </strong>
        </div>
      </div>

      <SectionHeader
        title="Application history"
        description="Review the progress of each opportunity you applied for."
      />

      <div className="filter-row">
        <label htmlFor="application-status">Filter by status</label>
        <select
          id="application-status"
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value)}
          className="form-select"
        >
          {statuses.map((status) => (
            <option key={status.value} value={status.value}>
              {status.label}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <LoadingSpinner message="Loading your applications..." />
      ) : error ? (
        <ErrorMessage message={error} onRetry={loadApplications} />
      ) : filteredApplications.length === 0 ? (
        <EmptyState
          title={
            applications.length === 0
              ? 'No applications yet'
              : 'No applications match this filter'
          }
          description={
            applications.length === 0
              ? 'Explore available opportunities and take the next step in your career.'
              : 'Choose another status to view more applications.'
          }
          action={
            applications.length === 0 ? (
              <Link to="/opportunities" className="button button-primary">
                Explore opportunities
              </Link>
            ) : null
          }
        />
      ) : (
        <div className="application-list">
          {filteredApplications.map((application) => (
            <ApplicationCard
              key={application.id ?? application.application_id}
              application={application}
            />
          ))}
        </div>
      )}
    </div>
  );
}
