import { Link, Outlet } from "react-router-dom";

export default function PublicLayout() {
  return (
    <div className="public-layout">
      <header className="site-header">
        <div className="site-header__inner">
          <Link to="/" className="site-logo">
            <span className="site-logo__mark">S</span>
            <span>SkillBridge SA</span>
          </Link>

          <nav className="site-nav" aria-label="Main navigation">
            <Link to="/">Home</Link>
            <Link to="/opportunities">Opportunities</Link>
            <Link to="/career-pathways">Career pathways</Link>
          </nav>

          <div className="site-header__actions">
            <Link to="/login" className="button button--secondary">
              Log in
            </Link>
            <Link to="/register" className="button button--primary">
              Get started
            </Link>
          </div>
        </div>
      </header>

      <main className="public-layout__content">
        <Outlet />
      </main>

      <footer className="site-footer">
        <div className="site-footer__inner">
          <p>
            <strong>SkillBridge SA</strong> — Turn your skills into your next
            opportunity.
          </p>
          <p>
            Connecting skills, learning and opportunity across South Africa.
          </p>
          <p className="site-footer__copyright">
            © {new Date().getFullYear()} SkillBridge SA
          </p>
        </div>
      </footer>
    </div>
  );
}