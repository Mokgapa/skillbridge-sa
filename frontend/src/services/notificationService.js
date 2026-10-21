import api from "./api";

const notificationService = {
  // Get all notifications for the current user
  getAll() {
    return api.get("/notifications/");
  },

  // Get unread notifications
  getUnread() {
    return api.get("/notifications/unread");
  },

  // Mark one notification as read
  markAsRead(notificationId) {
    return api.patch(`/notifications/${notificationId}/read`, {});
  },

  // Mark all notifications as read
  markAllAsRead() {
    return api.patch("/notifications/read-all", {});
  },

  // Delete a notification
  remove(notificationId) {
    return api.delete(`/notifications/${notificationId}`);
  },
};

export default notificationService;