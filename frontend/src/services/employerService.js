import api from "./api";

const employerService = {
  // Get the current employer's profile
  getMyProfile() {
    return api.get("/employers/me");
  },

  // Create an employer profile
  createProfile(profileData) {
    return api.post("/employers/me", profileData);
  },

  // Update an employer profile
  updateProfile(profileData) {
    return api.put("/employers/me", profileData);
  },

  // Get a public employer profile
  getById(employerId) {
    return api.get(`/employers/${employerId}`);
  },
};

export default employerService;