
import { Link, useLocation } from "react-router-dom";

export default function NotFoundPage() {
  const location = useLocation();

  return (
    <main className="not-found-page">
      <div className="not-found-page__content">
        <span className="not-found-page__code">404</span>

        <h1>Looks like you took a wrong turn.</h1>

        <p>
          The page you’re looking for may have moved, or the address
          may be incorrect.
        </p>

        <p className="not-found-page__path">
          Requested address: <code>{location.pathname}</code>
        </p>

        <div className="not-found-page__actions">
          <Link to="/" className="button button--primary">
            Back to home
          </Link>

          <Link to="/opportunities" className="button button--secondary">
            Explore opportunities
          </Link>
        </div>
      </div>
    </main>
  );
}
