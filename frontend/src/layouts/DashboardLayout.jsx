import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const navigationByRole = {
  candidate: [
    { label: "Dashboard", to: "/candidate/dashboard" },
    { label: "My profile", to: "/candidate/profile" },
    { label: "Opportunities", to: "/opportunities" },
    { label: "My applications", to: "/candidate/applications" },
    { label: "Career pathways", to: "/career-pathways" },
    { label: "Mentorship", to: "/candidate/mentorship" },
  ],
  employer: [
    { label: "Dashboard", to: "/employer/dashboard" },
    { label: "Company profile", to: "/employer/profile" },
    { label: "My opportunities", to: "/employer/opportunities" },
    { label: "Applications", to: "/employer/applications" },
  ],
  admin: [
    { label: "Dashboard", to: "/admin/dashboard" },
    { label: "Users", to: "/admin/users" },
    { label: "Opportunities", to: "/admin/opportunities" },
  ],
};

export default function DashboardLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const roleValue = user?.role?.name ?? user?.role ?? user?.roles?.[0]?.name;
  const role = String(roleValue || "candidate").toLowerCase();
  const navigation = navigationByRole[role] || navigationByRole.candidate;

  function handleLogout() {
    logout();
    navigate("/login", { replace: true });
  }

  const displayName =
    user?.full_name ||
    [user?.first_name, user?.last_name].filter(Boolean).join(" ") ||
    user?.name ||
    user?.email ||
    "Account";

  return (
    <div className="dashboard-layout">
      <aside className="dashboard-sidebar">
        <NavLink to="/" className="site-logo dashboard-sidebar__logo">
          <span className="site-logo__mark">S</span>
          <span>SkillBridge SA</span>
        </NavLink>

        <div className="dashboard-sidebar__user">
          <div className="dashboard-sidebar__avatar" aria-hidden="true">
            {displayName.charAt(0).toUpperCase()}
          </div>
          <div className="dashboard-sidebar__user-info">
            <strong>{displayName}</strong>
            <span>{role.replace(/_/g, " ")}</span>
          </div>
        </div>

        <nav className="dashboard-nav" aria-label="Dashboard navigation">
          {navigation.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `dashboard-nav__link${isActive ? " dashboard-nav__link--active" : ""}`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="dashboard-sidebar__bottom">
          <NavLink to="/settings" className="dashboard-nav__link">
            Settings
          </NavLink>
          <button
            type="button"
            className="dashboard-nav__logout"
            onClick={handleLogout}
          >
            Log out
          </button>
        </div>
      </aside>

      <div className="dashboard-layout__main">
        <header className="dashboard-topbar">
          <div>
            <span className="dashboard-topbar__eyebrow">SKILLBRIDGE SA</span>
            <h1>Welcome, {displayName}</h1>
          </div>
          <NavLink
            to="/notifications"
            className="dashboard-topbar__notifications"
          >
            Notifications
          </NavLink>
        </header>

        <main className="dashboard-content">
          <Outlet />
        </main>

        <footer className="dashboard-footer">
          SkillBridge SA — Turn your skills into your next opportunity.
        </footer>
      </div>
    </div>
  );
}