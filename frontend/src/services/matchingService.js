import api from "./api";

const matchingService = {
  // Get opportunities matched to the current candidate
  getMyMatches() {
    return api.get("/matching/");
  },

  // Get match details for a specific opportunity
  getMatchByOpportunityId(opportunityId) {
    return api.get(`/matching/opportunity/${opportunityId}`);
  },

  // Calculate or refresh matches
  refreshMatches() {
    return api.post("/matching/refresh", {});
  },

  // Get the candidate's skill-gap analysis
  getSkillGaps() {
    return api.get("/skill-gaps/");
  },

  // Get recommended skills for a specific opportunity
  getRecommendedSkills(opportunityId) {
    return api.get(`/skill-gaps/opportunity/${opportunityId}`);
  },
};

export default matchingService;