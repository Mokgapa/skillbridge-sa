import api from "./api";

const opportunityService = {
  // Get all available opportunities
  getAllOpportunities(params = {}) {
    const query = new URLSearchParams(params).toString();
    const endpoint = query
      ? `/opportunities/?${query}`
      : "/opportunities/";

    return api.get(endpoint);
  },

  // Get a specific opportunity
  getOpportunityById(opportunityId) {
    return api.get(`/opportunities/${opportunityId}`);
  },

  // Create a new opportunity (employer)
  createOpportunity(opportunityData) {
    return api.post("/opportunities/", opportunityData);
  },

  // Update an existing opportunity
  updateOpportunity(opportunityId, opportunityData) {
    return api.put(`/opportunities/${opportunityId}`, opportunityData);
  },

  // Delete an opportunity
  deleteOpportunity(opportunityId) {
    return api.delete(`/opportunities/${opportunityId}`);
  },

  // Get recommended opportunities for the current candidate
  getRecommendedOpportunities() {
    return api.get("/matching/recommendations");
  },
};

export default opportunityService;