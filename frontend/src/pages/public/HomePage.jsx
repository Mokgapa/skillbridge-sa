
import { Link } from "react-router-dom";

const features = [
  {
    number: "01",
    title: "Discover opportunities",
    description:
      "Find jobs, internships and practical work experience suited to your interests and skills.",
  },
  {
    number: "02",
    title: "Build your skills",
    description:
      "Identify skills gaps, explore career pathways and develop skills employers are looking for.",
  },
  {
    number: "03",
    title: "Get matched",
    description:
      "Connect your skills and career goals with relevant opportunities and potential mentors.",
  },
];

const steps = [
  {
    number: "1",
    title: "Create your profile",
    description:
      "Tell us about your education, skills, certificates and career interests.",
  },
  {
    number: "2",
    title: "Explore your matches",
    description:
      "Discover opportunities and career pathways that fit your profile.",
  },
  {
    number: "3",
    title: "Take your next step",
    description:
      "Apply for opportunities, grow your skills and track your progress.",
  },
];

export default function HomePage() {
  return (
    <main className="home-page">
      <section className="home-hero">
        <div className="home-hero__content">
          <span className="home-hero__eyebrow">
            Your future starts with your skills
          </span>

          <h1>
            Turn your skills into your{" "}
            <span>next opportunity.</span>
          </h1>

          <p className="home-hero__description">
            SkillBridge SA connects South African talent with jobs,
            internships, mentors and learning opportunities to help
            you move forward in your career.
          </p>

          <div className="home-hero__actions">
            <Link to="/register" className="button button--primary">
              Get started
            </Link>

            <Link
              to="/opportunities"
              className="button button--secondary"
            >
              Explore opportunities
            </Link>
          </div>

          <p className="home-hero__note">
            Discover your strengths. Develop your skills. Build your future.
          </p>
        </div>

        <div className="home-hero__visual" aria-hidden="true">
          <div className="home-visual-card home-visual-card--main">
            <span className="home-visual-card__icon">✦</span>
            <p className="home-visual-card__label">Your next chapter</p>
            <h2>Skills meet opportunity.</h2>
            <div className="home-visual-card__line" />
            <div className="home-visual-card__line home-visual-card__line--short" />
          </div>

          <div className="home-visual-card home-visual-card--floating">
            <span className="home-visual-card__check">✓</span>
            <div>
              <strong>Keep growing</strong>
              <p>One step at a time</p>
            </div>
          </div>

          <div className="home-hero__decoration home-hero__decoration--one" />
          <div className="home-hero__decoration home-hero__decoration--two" />
        </div>
      </section>

      <section className="home-features section-container">
        <div className="section-heading">
          <span className="section-heading__eyebrow">What you can do</span>
          <h2>Build a bridge to your future</h2>
          <p>
            Get the tools and connections you need to take the next step
            in your career journey.
          </p>
        </div>

        <div className="home-features__grid">
          {features.map((feature) => (
            <article className="home-feature-card" key={feature.number}>
              <span className="home-feature-card__number">
                {feature.number}
              </span>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="home-how-it-works">
        <div className="section-container">
          <div className="section-heading">
            <span className="section-heading__eyebrow">Getting started</span>
            <h2>Your journey, made simpler</h2>
            <p>
              Take practical steps towards meaningful work and career growth.
            </p>
          </div>

          <div className="home-steps__grid">
            {steps.map((step) => (
              <article className="home-step" key={step.number}>
                <span className="home-step__number">{step.number}</span>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="home-cta section-container">
        <div className="home-cta__content">
          <span className="section-heading__eyebrow">Your next step starts here</span>
          <h2>Ready to discover what you can achieve?</h2>
          <p>
            Create your profile and start exploring opportunities that
            match your skills and ambitions.
          </p>
        </div>

        <Link to="/register" className="button button--primary">
          Join SkillBridge SA
        </Link>
      </section>
    </main>
  );
}
