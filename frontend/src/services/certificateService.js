import api from "./api";

const certificateService = {
  // Get all certificates
  getAll() {
    return api.get("/certificates/");
  },

  // Get one certificate
  getById(certificateId) {
    return api.get(`/certificates/${certificateId}`);
  },

  // Add a certificate
  create(certificateData) {
    return api.post("/certificates/", certificateData);
  },

  // Update a certificate
  update(certificateId, certificateData) {
    return api.put(`/certificates/${certificateId}`, certificateData);
  },

  // Delete a certificate
  remove(certificateId) {
    return api.delete(`/certificates/${certificateId}`);
  },
};

export default certificateService;