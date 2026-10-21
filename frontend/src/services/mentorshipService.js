import api from "./api";

const mentorshipService = {
  // Get mentorship opportunities or requests
  getAll() {
    return api.get("/mentorship/");
  },

  // Get a specific mentorship record
  getById(mentorshipId) {
    return api.get(`/mentorship/${mentorshipId}`);
  },

  // Request mentorship
  requestMentorship(mentorshipData) {
    return api.post("/mentorship/", mentorshipData);
  },

  // Update a mentorship request
  update(mentorshipId, mentorshipData) {
    return api.put(`/mentorship/${mentorshipId}`, mentorshipData);
  },

  // Cancel or remove a mentorship request
  cancel(mentorshipId) {
    return api.delete(`/mentorship/${mentorshipId}`);
  },
};

export default mentorshipService;