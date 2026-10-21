javascript
import api from "./api";

const authService = {
  async register(userData) {
    return api.post("/auth/register", userData);
  },

  async login(credentials) {
    const formData = new URLSearchParams();

    formData.append("username", credentials.email);
    formData.append("password", credentials.password);

    return api.post("/auth/login", formData);
  },

  async getCurrentUser() {
    return api.get("/auth/me");
  },

  async logout() {
    // Clear client-side authentication state through AuthContext.
    // The backend can later support token revocation if required.
    return { message: "Logged out successfully." };
  },
};

export default authService;
