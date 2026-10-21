
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { userService } from "../../services";

export default function AdminDashboardPage() {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadUsers() {
      try {
        if (typeof userService?.getAll !== "function") {
          throw new Error(
            "The user management service is not configured yet."
          );
        }

        const response = await userService.getAll();

        if (active) {
          const records = Array.isArray(response)
            ? response
            : response?.items ?? response?.users ?? response?.data ?? [];

          setUsers(Array.isArray(records) ? records : []);
        }
      } catch (err) {
        if (active) {
          setError(
            err?.message || "Unable to load users. Please try again later."
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadUsers();

    return () => {
      active = false;
    };
  }, []);

  return (
    <section className="page-container admin-dashboard">
      <header className="page-header">
        <div>
          <p className="page-eyebrow">SkillBridge SA</p>
          <h1>Admin Dashboard</h1>
          <p>
            Welcome{user?.full_name ? `, ${user.full_name}` : ""}. Manage and
            monitor the platform from here.
          </p>
        </div>
      </header>

      <div className="dashboard-stats">
        <article className="dashboard-stat-card">
          <span className="dashboard-stat-label">Platform users</span>
          <strong className="dashboard-stat-value">
            {loading ? "…" : error ? "—" : users.length}
          </strong>
          <span className="dashboard-stat-description">
            Registered accounts returned by the user service
          </span>
        </article>

        <article className="dashboard-stat-card">
          <span className="dashboard-stat-label">Administration</span>
          <strong className="dashboard-stat-value">Users</strong>
          <span className="dashboard-stat-description">
            Review platform account information
          </span>
        </article>
      </div>

      <section className="dashboard-section">
        <div className="section-heading">
          <div>
            <h2>Platform management</h2>
            <p>Open an available administration area.</p>
          </div>
        </div>

        <div className="dashboard-action-grid">
          <Link className="dashboard-action-card" to="/admin/users">
            <h3>User management</h3>
            <p>View and manage registered platform accounts.</p>
            <span>Open users →</span>
          </Link>

          <Link className="dashboard-action-card" to="/admin/opportunities">
            <h3>Opportunity oversight</h3>
            <p>Review the opportunities available on the platform.</p>
            <span>Open opportunities →</span>
          </Link>

          <Link className="dashboard-action-card" to="/admin/reports">
            <h3>Reports</h3>
            <p>Open the platform reporting area when it is configured.</p>
            <span>Open reports →</span>
          </Link>
        </div>
      </section>

      {loading && (
        <p className="feedback-message" role="status">
          Loading platform users…
        </p>
      )}

      {error && (
        <div className="feedback-message error-message" role="alert">
          <p>{error}</p>
          <p>
            This page needs a compatible user service before the user count
            can be displayed.
          </p>
        </div>
      )}

      {!loading && !error && (
        <section className="dashboard-section">
          <div className="section-heading">
            <div>
              <h2>Recently returned users</h2>
              <p>
                Showing up to the first five records returned by the API.
              </p>
            </div>
          </div>

          {users.length === 0 ? (
            <p className="feedback-message">No user records were returned.</p>
          ) : (
            <div className="admin-user-list">
              {users.slice(0, 5).map((account, index) => (
                <article
                  className="admin-user-row"
                  key={account.id ?? account.user_id ?? index}
                >
                  <div>
                    <strong>
                      {account.full_name ||
                        account.name ||
                        account.email ||
                        "Unnamed user"}
                    </strong>
                    <p>{account.email || "No email available"}</p>
                  </div>
                  <span className="status-badge">
                    {account.role || account.user_type || "Account"}
                  </span>
                </article>
              ))}
            </div>
          )}
        </section>
      )}
    </section>
  );
}
