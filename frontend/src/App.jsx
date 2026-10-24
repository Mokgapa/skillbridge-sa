
import { useState } from 'react';
import './index.css';

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';

function App() {
  const [showLogin, setShowLogin] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  function openLogin(event) {
    event?.preventDefault();
    setError('');
    setSuccess('');
    setShowLogin(true);
  }

  function closeLogin() {
    if (loading) return;
    setShowLogin(false);
    setError('');
    setSuccess('');
    setPassword('');
  }

  async function handleLogin(event) {
    event.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          email: email.trim(),
          password,
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        if (response.status === 401 || response.status === 400) {
          throw new Error('Invalid email or password. Please try again.');
        }

        if (response.status === 422) {
          throw new Error('Please enter a valid email and password.');
        }

        throw new Error(
          data.detail || 'Login failed. Please try again.'
        );
      }

      if (!data.access_token) {
        throw new Error(
          'The server responded, but no access token was returned.'
        );
      }

      sessionStorage.setItem('skillbridge_access_token', data.access_token);

      setSuccess('Login successful! Your account has been authenticated.');
      setPassword('');
    } catch (err) {
      if (err instanceof TypeError) {
        setError(
          'Could not connect to SkillBridge SA. Check that the backend is running.'
        );
      } else {
        setError(err.message || 'Something went wrong. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  }

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
          <button
            className="login-link"
            type="button"
            onClick={openLogin}
            style={{
              border: 'none',
              background: 'transparent',
              cursor: 'pointer',
              font: 'inherit',
            }}
          >
            Log In
          </button>

          <a className="button button-small" href="#register">
            Get Started
          </a>
        </div>
      </header>

      <section className="hero" id="home">
        <div className="hero-content">
          <span className="eyebrow">YOUR SKILLS. YOUR FUTURE.</span>

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

      {showLogin && (
        <div
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeLogin();
          }}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
            background: 'rgba(10, 20, 35, 0.72)',
            backdropFilter: 'blur(5px)',
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="login-heading"
            style={{
              position: 'relative',
              width: '100%',
              maxWidth: '440px',
              padding: '32px',
              borderRadius: '18px',
              background: '#ffffff',
              color: '#172033',
              boxShadow: '0 24px 80px rgba(0,0,0,0.25)',
            }}
          >
            <button
              type="button"
              onClick={closeLogin}
              disabled={loading}
              aria-label="Close login"
              style={{
                position: 'absolute',
                top: '12px',
                right: '16px',
                border: 'none',
                background: 'transparent',
                fontSize: '28px',
                cursor: 'pointer',
                color: '#526071',
              }}
            >
              ×
            </button>

            <p
              style={{
                marginBottom: '8px',
                color: '#16845b',
                fontWeight: 700,
                letterSpacing: '1px',
              }}
            >
              SKILLBRIDGE SA
            </p>

            <h2 id="login-heading" style={{ marginTop: 0 }}>
              Welcome back
            </h2>

            <p style={{ color: '#526071', lineHeight: 1.5 }}>
              Log in to continue your career journey.
            </p>

            {success ? (
              <div>
                <p
                  role="status"
                  style={{
                    padding: '14px',
                    borderRadius: '8px',
                    background: '#e8f7ee',
                    color: '#17663a',
                    lineHeight: 1.5,
                  }}
                >
                  {success}
                </p>

                <button
                  type="button"
                  className="button"
                  onClick={closeLogin}
                  style={{ width: '100%', marginTop: '12px' }}
                >
                  Continue
                </button>
              </div>
            ) : (
              <form onSubmit={handleLogin}>
                <label
                  htmlFor="login-email"
                  style={{
                    display: 'block',
                    margin: '18px 0 6px',
                    fontWeight: 600,
                  }}
                >
                  Email address
                </label>

                <input
                  id="login-email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="you@example.com"
                  style={{
                    boxSizing: 'border-box',
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #cbd5e1',
                    borderRadius: '8px',
                    fontSize: '16px',
                  }}
                />

                <label
                  htmlFor="login-password"
                  style={{
                    display: 'block',
                    margin: '18px 0 6px',
                    fontWeight: 600,
                  }}
                >
                  Password
                </label>

                <input
                  id="login-password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Enter your password"
                  style={{
                    boxSizing: 'border-box',
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #cbd5e1',
                    borderRadius: '8px',
                    fontSize: '16px',
                  }}
                />

                {error && (
                  <p
                    role="alert"
                    style={{
                      marginTop: '14px',
                      color: '#b42318',
                      lineHeight: 1.5,
                    }}
                  >
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  className="button"
                  disabled={loading}
                  style={{
                    width: '100%',
                    marginTop: '22px',
                    opacity: loading ? 0.7 : 1,
                    cursor: loading ? 'wait' : 'pointer',
                  }}
                >
                  {loading ? 'Logging in…' : 'Log In'}
                </button>
              </form>
            )}
          </section>
        </div>
      )}
    </main>
  );
}

export default App;
