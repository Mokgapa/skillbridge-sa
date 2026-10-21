import api from "./api";

const microInternshipService = {
  // Get all micro-internship opportunities
  getAll() {
    return api.get("/micro-internships/");
  },

  // Get one micro-internship
  getById(internshipId) {
    return api.get(`/micro-internships/${internshipId}`);
  },

  // Apply for a micro-internship
  apply(internshipId, applicationData = {}) {
    return api.post(
      `/micro-internship-applications/`,
      {
        micro_internship_id: internshipId,
        ...applicationData,
      }
    );
  },

  // Get the candidate's micro-internship applications
  getMyApplications() {
    return api.get("/micro-internship-applications/me");
  },

  // Withdraw a micro-internship application
  withdrawApplication(applicationId) {
    return api.patch(
      `/micro-internship-applications/${applicationId}/withdraw`,
      {}
    );
  },
};

export default microInternshipService;