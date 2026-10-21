import api from "./api";

const workExperienceService = {
  // Get all work experience records
  getAll() {
    return api.get("/work-experience/");
  },

  // Get one work experience record
  getById(experienceId) {
    return api.get(`/work-experience/${experienceId}`);
  },

  // Add work experience
  create(experienceData) {
    return api.post("/work-experience/", experienceData);
  },

  // Update work experience
  update(experienceId, experienceData) {
    return api.put(`/work-experience/${experienceId}`, experienceData);
  },

  // Delete work experience
  remove(experienceId) {
    return api.delete(`/work-experience/${experienceId}`);
  },
};

export default workExperienceService;