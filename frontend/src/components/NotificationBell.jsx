
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import notificationService from "../services/notificationService";

export default function NotificationBell() {
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function loadUnreadCount() {
      try {
        const response = await notificationService.getUnreadCount();

        if (!active) return;

        const count =
          typeof response === "number"
            ? response
            : response?.unread_count ??
              response?.count ??
              response?.total ??
              0;

        setUnreadCount(Math.max(0, Number(count) || 0));
      } catch {
        if (active) {
          setUnreadCount(0);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadUnreadCount();

    return () => {
      active = false;
    };
  }, []);

  return (
    <Link
      to="/notifications"
      className="notification-bell"
      aria-label={
        loading
          ? "Notifications"
          : `Notifications, ${unreadCount} unread`
      }
      title="Notifications"
    >
      <span className="notification-bell__icon" aria-hidden="true">
        ♧
      </span>

      <span className="notification-bell__label">Notifications</span>

      {!loading && unreadCount > 0 && (
        <span className="notification-bell__count">
          {unreadCount > 99 ? "99+" : unreadCount}
        </span>
      )}
    </Link>
  );
}
