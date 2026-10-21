
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  EmptyState,
  ErrorMessage,
  LoadingSpinner,
  SectionHeader,
  SkillTag,
} from '../../components';
import { candidateService, skillService } from '../../services';

export default function CandidateSkillsPage() {
  const [profile, setProfile] = useState(null);
  const [availableSkills, setAvailableSkills] = useState([]);
  const [selectedSkill, setSelectedSkill] = useState('');
  const [proficiency, setProficiency] = useState('beginner');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  async function loadSkills() {
    setLoading(true);
    setError('');

    try {
      const [profileResponse, skillsResponse] = await Promise.all([
        candidateService.getProfile(),
        skillService.getAll(),
      ]);

      setProfile(profileResponse?.data ?? profileResponse);

      const skills =
        Array.isArray(skillsResponse)
          ? skillsResponse
          : skillsResponse?.items ?? skillsResponse?.skills ?? skillsResponse?.data ?? [];

      setAvailableSkills(Array.isArray(skills) ? skills : []);
    } catch (err) {
      setError(err?.message || 'Unable to load your skills. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadSkills();
  }, []);

  const candidateSkills =
    profile?.skills ??
    profile?.candidate_skills ??
    profile?.candidateSkills ??
    [];

  const selectedSkillIds = candidateSkills.map((item) =>
    String(item.skill_id ?? item.skillId ?? item.skill?.id ?? item.id)
  );

  const skillsToChoose = availableSkills.filter(
    (skill) => !selectedSkillIds.includes(String(skill.id ?? skill.skill_id))
  );

  async function handleAddSkill(event) {
    event.preventDefault();
    setError('');
    setMessage('');

    if (!selectedSkill) {
      setError('Please select a skill to add.');
      return;
    }

    setSaving(true);

    try {
      await candidateService.addSkill({
        skill_id: Number(selectedSkill),
        proficiency_level: proficiency,
      });

      setMessage('Skill added successfully.');
      setSelectedSkill('');
      await loadSkills();
    } catch (err) {
      setError(err?.message || 'Unable to add this skill. Please try again.');
    } finally {
      setSaving(false);
    }
  }

  async function handleRemoveSkill(skillId) {
    setError('');
    setMessage('');

    try {
      await candidateService.removeSkill(skillId);
      setMessage('Skill removed successfully.');
      await loadSkills();
    } catch (err) {
      setError(err?.message || 'Unable to remove this skill. Please try again.');
    }
  }

  if (loading) {
    return <LoadingSpinner message="Loading your skills..." />;
  }

  return (
    <div className="page-container candidate-skills-page">
      <div className="page-heading">
        <div>
          <p className="eyebrow">YOUR PROFESSIONAL PROFILE</p>
          <h1>My skills</h1>
          <p className="page-description">
            Showcase your abilities so SkillBridge SA can help match you with
            relevant opportunities.
          </p>
        </div>

        <Link to="/candidate" className="button button-secondary">
          Back to dashboard
        </Link>
      </div>

      {error && <ErrorMessage message={error} onRetry={loadSkills} />}

      {message && (
        <div className="alert alert-success" role="status">
          {message}
        </div>
      )}

      <section className="content-card">
        <SectionHeader
          title="Add a skill"
          description="Choose a skill and indicate your current proficiency."
        />

        <form className="inline-form" onSubmit={handleAddSkill}>
          <div className="form-group">
            <label htmlFor="skill-select">Available skills</label>
            <select
              id="skill-select"
              className="form-select"
              value={selectedSkill}
              onChange={(event) => setSelectedSkill(event.target.value)}
              required
            >
              <option value="">Select a skill</option>
              {skillsToChoose.map((skill) => (
                <option
                  key={skill.id ?? skill.skill_id}
                  value={skill.id ?? skill.skill_id}
                >
                  {skill.name ?? skill.skill_name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="skill-proficiency">Proficiency level</label>
            <select
              id="skill-proficiency"
              className="form-select"
              value={proficiency}
              onChange={(event) => setProficiency(event.target.value)}
            >
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
              <option value="expert">Expert</option>
            </select>
          </div>

          <button
            className="button button-primary"
            type="submit"
            disabled={saving || skillsToChoose.length === 0}
          >
            {saving ? 'Adding...' : 'Add skill'}
          </button>
        </form>

        {skillsToChoose.length === 0 && (
          <p className="helper-text">
            You have added all currently available skills.
          </p>
        )}
      </section>

      <section className="content-card">
        <SectionHeader
          title="Your skills"
          description={`${candidateSkills.length} skill${candidateSkills.length === 1 ? '' : 's'} in your profile`}
        />

        {candidateSkills.length === 0 ? (
          <EmptyState
            title="No skills added yet"
            description="Add your skills to improve your opportunity recommendations."
          />
        ) : (
          <div className="candidate-skill-list">
            {candidateSkills.map((item) => {
              const skill = item.skill ?? item;
              const skillId =
                item.skill_id ?? item.skillId ?? skill.id ?? item.id;
              const skillName =
                skill.name ?? skill.skill_name ?? item.name ?? 'Unnamed skill';
              const level =
                item.proficiency_level ??
                item.proficiencyLevel ??
                item.level ??
                'Not specified';

              return (
                <div
                  className="candidate-skill-item"
                  key={skillId ?? skillName}
                >
                  <div className="candidate-skill-details">
                    <SkillTag skill={skillName} />
                    <span className="proficiency-label">
                      {String(level).replaceAll('_', ' ')}
                    </span>
                  </div>

                  <button
                    type="button"
                    className="button button-danger button-small"
                    onClick={() => handleRemoveSkill(skillId)}
                  >
                    Remove
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
