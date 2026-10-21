import api from "./api";

const projectService = {
  // Get all portfolio projects
  getAll() {
    return api.get("/projects/");
  },

  // Get one project
  getById(projectId) {
    return api.get(`/projects/${projectId}`);
  },

  // Add a portfolio project
  create(projectData) {
    return api.post("/projects/", projectData);
  },

  // Update a portfolio project
  update(projectId, projectData) {
    return api.put(`/projects/${projectId}`, projectData);
  },

  // Delete a portfolio project
  remove(projectId) {
    return api.delete(`/projects/${projectId}`);
  },
};

export default projectService;