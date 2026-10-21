javascript
import api from "./api";

const candidateService = {
  // Candidate profile
  getProfile() {
    return api.get("/candidates/me");
  },

  createProfile(profileData) {
    return api.post("/candidates/me", profileData);
  },

  updateProfile(profileData) {
    return api.put("/candidates/me", profileData);
  },

  // Education
  getEducation() {
    return api.get("/education/");
  },

  addEducation(educationData) {
    return api.post("/education/", educationData);
  },

  updateEducation(educationId, educationData) {
    return api.put(`/education/${educationId}`, educationData);
  },

  deleteEducation(educationId) {
    return api.delete(`/education/${educationId}`);
  },

  // Certificates
  getCertificates() {
    return api.get("/certificates/");
  },

  addCertificate(certificateData) {
    return api.post("/certificates/", certificateData);
  },

  updateCertificate(certificateId, certificateData) {
    return api.put(`/certificates/${certificateId}`, certificateData);
  },

  deleteCertificate(certificateId) {
    return api.delete(`/certificates/${certificateId}`);
  },

  // Work experience
  getWorkExperience() {
    return api.get("/work-experience/");
  },

  addWorkExperience(experienceData) {
    return api.post("/work-experience/", experienceData);
  },

  updateWorkExperience(experienceId, experienceData) {
    return api.put(
      `/work-experience/${experienceId}`,
      experienceData
    );
  },

  deleteWorkExperience(experienceId) {
    return api.delete(`/work-experience/${experienceId}`);
  },

  // Projects
  getProjects() {
    return api.get("/projects/");
  },

  addProject(projectData) {
    return api.post("/projects/", projectData);
  },

  updateProject(projectId, projectData) {
    return api.put(`/projects/${projectId}`, projectData);
  },

  deleteProject(projectId) {
    return api.delete(`/projects/${projectId}`);
  },
};

export default candidateService;
