import api from "./api";

const applicationService = {
  // Apply for an opportunity
  applyForOpportunity(opportunityId, applicationData = {}) {
    return api.post(`/applications/`, {
      opportunity_id: opportunityId,
      ...applicationData,
    });
  },

  // Get the current candidate's applications
  getMyApplications() {
    return api.get("/applications/me");
  },

  // Get one application by ID
  getApplicationById(applicationId) {
    return api.get(`/applications/${applicationId}`);
  },

  // Withdraw an application
  withdrawApplication(applicationId) {
    return api.patch(`/applications/${applicationId}/withdraw`, {});
  },

  // Get applications for an employer's opportunities
  getEmployerApplications() {
    return api.get("/applications/employer");
  },

  // Update an application's status (employer)
  updateApplicationStatus(applicationId, statusData) {
    return api.patch(`/applications/${applicationId}/status`, statusData);
  },
};

export default applicationService;