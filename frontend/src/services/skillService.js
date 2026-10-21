import api from "./api";

const skillService = {
  // Get all available skills
  getAllSkills() {
    return api.get("/skills/");
  },

  // Get the current candidate's skills
  getMySkills() {
    return api.get("/skills/me");
  },

  // Add a skill to the candidate's profile
  addSkill(skillData) {
    return api.post("/skills/me", skillData);
  },

  // Update a candidate skill
  updateSkill(skillId, skillData) {
    return api.put(`/skills/me/${skillId}`, skillData);
  },

  // Remove a skill from the candidate's profile
  removeSkill(skillId) {
    return api.delete(`/skills/me/${skillId}`);
  },
};

export default skillService;