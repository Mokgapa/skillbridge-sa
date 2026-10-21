import { Link, Outlet } from "react-router-dom";

export default function AuthLayout() {
  return (
    <div className="auth-layout">
      <aside className="auth-layout__panel">
        <Link to="/" className="site-logo site-logo--light">
          <span className="site-logo__mark">S</span>
          <span>SkillBridge SA</span>
        </Link>

        <div className="auth-layout__message">
          <span className="auth-layout__eyebrow">YOUR NEXT CHAPTER STARTS HERE</span>

          <h1>Turn your skills into your next opportunity.</h1>

          <p>
            Discover career pathways, showcase your skills, and connect with
            opportunities that help you grow.
          </p>

          <div className="auth-layout__features">
            <div className="auth-layout__feature">
              <span aria-hidden="true">✓</span>
              Build your professional profile
            </div>
            <div className="auth-layout__feature">
              <span aria-hidden="true">✓</span>
              Discover relevant opportunities
            </div>
            <div className="auth-layout__feature">
              <span aria-hidden="true">✓</span>
              Develop skills for your future
            </div>
          </div>
        </div>

        <p className="auth-layout__panel-footer">
          Connecting South African talent with opportunity.
        </p>
      </aside>

      <main className="auth-layout__main">
        <div className="auth-layout__mobile-logo">
          <Link to="/" className="site-logo">
            <span className="site-logo__mark">S</span>
            <span>SkillBridge SA</span>
          </Link>
        </div>

        <div className="auth-layout__content">
          <Outlet />
        </div>

        <footer className="auth-layout__footer">
          <Link to="/">Back to home</Link>
          <span>© {new Date().getFullYear()} SkillBridge SA</span>
        </footer>
      </main>
    </div>
  );
}