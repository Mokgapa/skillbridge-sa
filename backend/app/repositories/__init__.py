from app.repositories.base_repository import BaseRepository
from app.repositories.user_repository import UserRepository
from app.repositories.candidate_repository import CandidateRepository
from app.repositories.skill_repository import SkillRepository
from app.repositories.education_repository import EducationRepository
from app.repositories.certificate_repository import CertificateRepository
from app.repositories.work_experience_repository import WorkExperienceRepository
from app.repositories.project_repository import ProjectRepository
from app.repositories.employer_repository import EmployerRepository
from app.repositories.opportunity_repository import OpportunityRepository
from app.repositories.opportunity_skill_repository import OpportunitySkillRepository
from app.repositories.application_repository import ApplicationRepository
from app.repositories.match_repository import MatchRepository
from app.repositories.mentorship_repository import MentorshipRepository
from app.repositories.notification_repository import NotificationRepository


__all__ = [
    "BaseRepository",
    "UserRepository",
    "CandidateRepository",
    "SkillRepository",
    "EducationRepository",
    "CertificateRepository",
    "WorkExperienceRepository",
    "ProjectRepository",
    "EmployerRepository",
    "OpportunityRepository",
    "OpportunitySkillRepository",
    "ApplicationRepository",
    "MatchRepository",
    "MentorshipRepository",
    "NotificationRepository",
]