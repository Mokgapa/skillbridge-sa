import api from "./api";

const careerPathwayService = {
  // Get all career pathways
  getAll() {
    return api.get("/career-pathways/");
  },

  // Get a specific career pathway
  getById(pathwayId) {
    return api.get(`/career-pathways/${pathwayId}`);
  },

  // Get recommended career pathways
  getRecommended() {
    return api.get("/career-pathways/recommended");
  },

  // Search career pathways
  search(searchTerm) {
    const query = new URLSearchParams({ search: searchTerm }).toString();
    return api.get(`/career-pathways/?${query}`);
  },
};

export default careerPathwayService;