export const APP_NAME = "SkillBridge SA";

export const APP_TAGLINE = "Turn your skills into your next opportunity.";

export const USER_ROLES = {
  CANDIDATE: "candidate",
  EMPLOYER: "employer",
  ADMIN: "admin",
};

export const OPPORTUNITY_TYPES = {
  JOB: "job",
  INTERNSHIP: "internship",
  LEARNERSHIP: "learnership",
  MICRO_INTERNSHIP: "micro_internship",
  VOLUNTEERING: "volunteering",
};

export const APPLICATION_STATUSES = {
  PENDING: "pending",
  REVIEWING: "reviewing",
  SHORTLISTED: "shortlisted",
  INTERVIEW: "interview",
  ACCEPTED: "accepted",
  REJECTED: "rejected",
  WITHDRAWN: "withdrawn",
};

export const OPPORTUNITY_STATUSES = {
  DRAFT: "draft",
  PUBLISHED: "published",
  CLOSED: "closed",
  ARCHIVED: "archived",
};

export const NOTIFICATION_TYPES = {
  APPLICATION_UPDATE: "application_update",
  NEW_OPPORTUNITY: "new_opportunity",
  MENTORSHIP_UPDATE: "mentorship_update",
  SYSTEM: "system",
};

export const SOUTH_AFRICAN_PROVINCES = [
  "Eastern Cape",
  "Free State",
  "Gauteng",
  "KwaZulu-Natal",
  "Limpopo",
  "Mpumalanga",
  "North West",
  "Northern Cape",
  "Western Cape",
];

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 100,
};

export const API_ERROR_MESSAGES = {
  NETWORK: "Unable to connect to SkillBridge SA. Please check your internet connection.",
  UNAUTHORIZED: "Your session has expired. Please log in again.",
  FORBIDDEN: "You do not have permission to perform this action.",
  NOT_FOUND: "The requested information could not be found.",
  SERVER: "Something went wrong on our side. Please try again later.",
};