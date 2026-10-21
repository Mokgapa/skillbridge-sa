
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  EmptyState,
  ErrorMessage,
  LoadingSpinner,
  SectionHeader,
  StatusBadge,
} from '../../components';
import { mentorshipService } from '../../services';

export default function CandidateMentorshipPage() {
  const [mentors, setMentors] = useState([]);
  const [myRequests, setMyRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [requestingId, setRequestingId] = useState(null);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  async function loadMentorship() {
    setLoading(true);
    setError('');

    try {
      const results = await Promise.allSettled([
        mentorshipService.getAll(),
        mentorshipService.getMyRequests(),
      ]);

      const mentorResult = results[0];
      const requestsResult = results[1];

      if (mentorResult.status === 'fulfilled') {
        const response = mentorResult.value;
        const records = Array.isArray(response)
          ? response
          : response?.items ?? response?.mentors ?? response?.data ?? [];

        setMentors(Array.isArray(records) ? records : []);
      } else {
        throw mentorResult.reason;
      }

      if (requestsResult.status === 'fulfilled') {
        const response = requestsResult.value;
        const records = Array.isArray(response)
          ? response
          : response?.items ?? response?.requests ?? response?.data ?? [];

        setMyRequests(Array.isArray(records) ? records : []);
      } else {
        setMyRequests([]);
      }
    } catch (err) {
      setError(err?.message || 'Unable to load mentorship opportunities.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadMentorship();
  }, []);

  async function handleRequest(mentor) {
    const mentorId = mentor.id ?? mentor.mentor_id ?? mentor.user_id;

    if (mentorId == null) {
      setError('This mentor does not have a valid identifier.');
      return;
    }

    setRequestingId(mentorId);
    setError('');
    setMessage('');

    try {
      await mentorshipService.request({
        mentor_id: mentorId,
        message:
          'I would like mentorship to help develop my skills and career.',
      });

      setMessage('Your mentorship request has been submitted.');
      await loadMentorship();
    } catch (err) {
      setError(err?.message || 'Unable to submit your mentorship request.');
    } finally {
      setRequestingId(null);
    }
  }

  const requestedMentorIds = new Set(
    myRequests
      .filter(
        (request) =>
          !['rejected', 'cancelled', 'canceled'].includes(
            String(request.status || '').toLowerCase()
          )
      )
      .map((request) =>
        String(
          request.mentor_id ??
            request.mentor?.id ??
            request.mentor_user_id ??
            ''
        )
      )
  );

  if (loading) {
    return <LoadingSpinner message="Loading mentorship opportunities..." />;
  }

  return (
    <div className="page-container candidate-mentorship-page">
      <div className="page-heading">
        <div>
          <p className="eyebrow">LEARN FROM EXPERIENCE</p>
          <h1>Mentorship</h1>
          <p className="page-description">
            Connect with experienced professionals who can support your career
            growth and skills development.
          </p>
        </div>

        <Link to="/candidate" className="button button-secondary">
          Back to dashboard
        </Link>
      </div>

      {error && <ErrorMessage message={error} onRetry={loadMentorship} />}

      {message && (
        <div className="alert alert-success" role="status">
          {message}
        </div>
      )}

      <section className="content-card">
        <SectionHeader
          title="My mentorship requests"
          description="Keep track of requests you have submitted."
        />

        {myRequests.length === 0 ? (
          <p className="muted-text">
            You have not submitted any mentorship requests yet.
          </p>
        ) : (
          <div className="record-list">
            {myRequests.map((request, index) => {
              const id = request.id ?? request.request_id ?? index;
              const mentorName =
                request.mentor?.full_name ??
                request.mentor?.name ??
                request.mentor_name ??
                'Mentor';

              return (
                <article className="record-card" key={id}>
                  <div className="record-card-content">
                    <h3>{mentorName}</h3>
                    {request.message && <p>{request.message}</p>}
                    <p className="record-meta">
                      Submitted:{' '}
                      {request.created_at
                        ? String(request.created_at).slice(0, 10)
                        : 'Date unavailable'}
                    </p>
                  </div>

                  <StatusBadge status={request.status ?? 'pending'} />
                </article>
              );
            })}
          </div>
        )}
      </section>

      <section className="pathway-section">
        <SectionHeader
          title="Discover mentors"
          description="Explore available professionals and request mentorship."
        />

        {mentors.length === 0 ? (
          <EmptyState
            title="No mentors available yet"
            description="Mentorship opportunities will appear here when professionals become available."
          />
        ) : (
          <div className="mentor-grid">
            {mentors.map((mentor) => {
              const mentorId =
                mentor.id ?? mentor.mentor_id ?? mentor.user_id;
              const alreadyRequested = requestedMentorIds.has(
                String(mentorId)
              );
              const mentorName =
                mentor.full_name ??
                mentor.name ??
                mentor.user?.full_name ??
                'SkillBridge mentor';

              return (
                <article className="mentor-card" key={mentorId ?? mentorName}>
                  <div className="mentor-avatar" aria-hidden="true">
                    {mentorName
                      .split(' ')
                      .filter(Boolean)
                      .slice(0, 2)
                      .map((part) => part[0])
                      .join('')
                      .toUpperCase()}
                  </div>

                  <h2>{mentorName}</h2>

                  <p className="mentor-title">
                    {mentor.job_title ??
                      mentor.profession ??
                      mentor.expertise ??
                      'Experienced professional'}
                  </p>

                  {mentor.company && (
                    <p className="muted-text">{mentor.company}</p>
                  )}

                  {mentor.bio && <p>{mentor.bio}</p>}

                  {mentor.expertise && (
                    <div className="tag-list">
                      <span className="technology-tag">
                        {mentor.expertise}
                      </span>
                    </div>
                  )}

                  <button
                    type="button"
                    className="button button-primary"
                    disabled={alreadyRequested || requestingId === mentorId}
                    onClick={() => handleRequest(mentor)}
                  >
                    {requestingId === mentorId
                      ? 'Submitting...'
                      : alreadyRequested
                        ? 'Request submitted'
                        : 'Request mentorship'}
                  </button>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
