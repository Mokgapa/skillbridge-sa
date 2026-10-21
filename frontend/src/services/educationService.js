import api from "./api";

const educationService = {
  // Get the candidate's education records
  getAll() {
    return api.get("/education/");
  },

  // Get one education record
  getById(educationId) {
    return api.get(`/education/${educationId}`);
  },

  // Add an education record
  create(educationData) {
    return api.post("/education/", educationData);
  },

  // Update an education record
  update(educationId, educationData) {
    return api.put(`/education/${educationId}`, educationData);
  },

  // Delete an education record
  remove(educationId) {
    return api.delete(`/education/${educationId}`);
  },
};

export default educationService;