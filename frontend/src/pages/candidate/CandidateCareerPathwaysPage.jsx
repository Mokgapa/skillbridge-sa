
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  EmptyState,
  ErrorMessage,
  LoadingSpinner,
  SectionHeader,
} from '../../components';
import { careerPathwayService } from '../../services';

export default function CandidateCareerPathwaysPage() {
  const [pathways, setPathways] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  async function loadPathways() {
    setLoading(true);
    setError('');

    try {
      const response = await careerPathwayService.getAll();
      const records = Array.isArray(response)
        ? response
        : response?.items ?? response?.pathways ?? response?.data ?? [];

      setPathways(Array.isArray(records) ? records : []);
    } catch (err) {
      setError(err?.message || 'Unable to load career pathways.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadPathways();
  }, []);

  const filteredPathways = pathways.filter((pathway) => {
    const searchText = search.trim().toLowerCase();

    if (!searchText) return true;

    const searchableText = [
      pathway.title,
      pathway.name,
      pathway.description,
      pathway.industry,
      pathway.career_area,
    ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase();

    return searchableText.includes(searchText);
  });

  return (
    <div className="page-container candidate-pathways-page">
      <div className="page-heading">
        <div>
          <p className="eyebrow">PLAN YOUR FUTURE</p>
          <h1>Career pathways</h1>
          <p className="page-description">
            Explore possible career directions and discover how to build the
            skills needed for your next opportunity.
          </p>
        </div>

        <Link to="/candidate" className="button button-secondary">
          Back to dashboard
        </Link>
      </div>

      {error && <ErrorMessage message={error} onRetry={loadPathways} />}

      <section className="content-card">
        <SectionHeader
          title="Explore career options"
          description="Search pathways by career title, industry or description."
        />

        <div className="form-group">
          <label htmlFor="pathway-search">Search career pathways</label>
          <input
            id="pathway-search"
            type="search"
            className="form-input"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="e.g. software development, data analysis"
          />
        </div>
      </section>

      {loading ? (
        <LoadingSpinner message="Loading career pathways..." />
      ) : filteredPathways.length === 0 ? (
        <EmptyState
          title={search ? 'No matching pathways found' : 'No pathways available yet'}
          description={
            search
              ? 'Try another career title or keyword.'
              : 'Career pathways will appear here when they are available.'
          }
          action={
            search ? (
              <button
                type="button"
                className="button button-secondary"
                onClick={() => setSearch('')}
              >
                Clear search
              </button>
            ) : null
          }
        />
      ) : (
        <section className="pathway-section">
          <SectionHeader
            title="Available pathways"
            description={`${filteredPathways.length} career pathway${filteredPathways.length === 1 ? '' : 's'} found`}
          />

          <div className="pathway-grid">
            {filteredPathways.map((pathway) => {
              const id = pathway.id ?? pathway.pathway_id;
              const title = pathway.title ?? pathway.name ?? 'Career pathway';
              const skills = Array.isArray(pathway.skills)
                ? pathway.skills
                : Array.isArray(pathway.required_skills)
                  ? pathway.required_skills
                  : [];

              return (
                <article className="pathway-card" key={id ?? title}>
                  <div className="pathway-card-icon" aria-hidden="true">
                    <span>↗</span>
                  </div>

                  <h2>{title}</h2>

                  {(pathway.industry || pathway.career_area) && (
                    <p className="pathway-category">
                      {pathway.industry ?? pathway.career_area}
                    </p>
                  )}

                  <p className="pathway-description">
                    {pathway.description ||
                      'Explore this career direction and the skills it may require.'}
                  </p>

                  {skills.length > 0 && (
                    <div className="pathway-skills">
                      <h3>Relevant skills</h3>
                      <div className="tag-list">
                        {skills.slice(0, 6).map((item, index) => {
                          const skillName =
                            typeof item === 'string'
                              ? item
                              : item.name ?? item.skill_name ?? 'Skill';

                          return (
                            <span
                              className="technology-tag"
                              key={`${skillName}-${index}`}
                            >
                              {skillName}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {id != null && (
                    <Link
                      to={`/candidate/career-pathways/${id}`}
                      className="text-link"
                    >
                      Explore pathway →
                    </Link>
                  )}
                </article>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
