
import './index.css';

function App() {
  return (
    <main className="app">
      <header className="navbar">
        <a className="logo" href="#home">
          SkillBridge <span>SA</span>
        </a>

        <nav aria-label="Main navigation">
          <a href="#home">Home</a>
          <a href="#how-it-works">How It Works</a>
          <a href="#opportunities">Opportunities</a>
        </nav>

        <div className="nav-actions">
          <a className="login-link" href="#login">
            Log In
          </a>
          <a className="button button-small" href="#register">
            Get Started
          </a>
        </div>
      </header>

      <section className="hero" id="home">
        <div className="hero-content">
          <span className="eyebrow">
            YOUR SKILLS. YOUR FUTURE.
          </span>

          <h1>
            Turn your skills into your next{' '}
            <span>opportunity.</span>
          </h1>

          <p className="hero-description">
            Connect your skills, discover opportunities, and build
            your career with SkillBridge SA. Your next step starts here.
          </p>

          <div className="hero-actions">
            <a className="button" href="#register">
              Find Opportunities →
            </a>
            <a className="button button-outline" href="#how-it-works">
              Learn More
            </a>
          </div>

          <div className="hero-note">
            Built to connect South African talent with opportunity.
          </div>
        </div>

        <div className="hero-card">
          <div className="card-icon">✦</div>
          <p className="card-label">YOUR NEXT CHAPTER</p>
          <h2>Your potential deserves an opportunity.</h2>
          <div className="card-divider" />
          <div className="card-feature">
            <span>✓</span> Showcase your skills
          </div>
          <div className="card-feature">
            <span>✓</span> Discover career opportunities
          </div>
          <div className="card-feature">
            <span>✓</span> Grow your professional profile
          </div>
        </div>
      </section>

      <section className="features" id="how-it-works">
        <div className="section-heading">
          <span className="eyebrow">HOW IT WORKS</span>
          <h2>One platform. New possibilities.</h2>
          <p>
            Take practical steps towards your next career opportunity.
          </p>
        </div>

        <div className="feature-grid">
          <article className="feature-card">
            <div className="feature-icon">01</div>
            <h3>Create Your Profile</h3>
            <p>
              Present your skills, qualifications, certificates,
              and experience in one place.
            </p>
          </article>

          <article className="feature-card">
            <div className="feature-icon">02</div>
            <h3>Discover Opportunities</h3>
            <p>
              Explore opportunities that align with your abilities
              and career goals.
            </p>
          </article>

          <article className="feature-card">
            <div className="feature-icon">03</div>
            <h3>Take Your Next Step</h3>
            <p>
              Connect your profile with opportunities for learning,
              development, and employment.
            </p>
          </article>
        </div>
      </section>

      <section className="opportunities" id="opportunities">
        <div>
          <span className="eyebrow">FOR CANDIDATES AND EMPLOYERS</span>
          <h2>Let's bridge the gap between skills and opportunity.</h2>
        </div>

        <div className="opportunity-actions">
          <a className="button" href="#register">
            I'm a Candidate
          </a>
          <a className="button button-outline" href="#employer">
            I'm an Employer
          </a>
        </div>
      </section>

      <footer className="footer">
        <a className="logo" href="#home">
          SkillBridge <span>SA</span>
        </a>
        <p>Connecting skills to opportunities across South Africa.</p>
        <p>© {new Date().getFullYear()} SkillBridge SA</p>
      </footer>
    </main>
  );
}

export default App;
