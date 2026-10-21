from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.controllers import (
    application_controller,
    auth_controller,
    candidate_controller,
    career_pathway_controller,
    certificate_controller,
    education_controller,
    employer_controller,
    matching_controller,
    mentorship_controller,
    micro_internship_application_controller,
    micro_internship_controller,
    notification_controller,
    opportunity_controller,
    project_controller,
    skill_controller,
    skill_gap_controller,
    user_controller,
)

app = FastAPI(
    title="SkillBridge SA API",
    description=(
        "Backend API for SkillBridge SA, a platform connecting "
        "South African job seekers with skills development, "
        "career pathways, internships, and employment opportunities."
    ),
    version="1.0.0",
)

# Allow the React frontend to communicate with the backend.
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/", tags=["General"])
def root():
    return {
        "message": "Welcome to the SkillBridge SA API",
        "version": "1.0.0",
        "documentation": "/docs",
    }


@app.get("/health", tags=["General"])
def health_check():
    return {
        "status": "healthy",
        "application": "SkillBridge SA",
    }


# Register application controllers.
app.include_router(auth_controller.router)
app.include_router(user_controller.router)
app.include_router(candidate_controller.router)
app.include_router(skill_controller.router)
app.include_router(education_controller.router)
app.include_router(certificate_controller.router)
app.include_router(project_controller.router)
app.include_router(employer_controller.router)
app.include_router(opportunity_controller.router)
app.include_router(application_controller.router)
app.include_router(matching_controller.router)
app.include_router(career_pathway_controller.router)
app.include_router(skill_gap_controller.router)
app.include_router(notification_controller.router)
app.include_router(mentorship_controller.router)
app.include_router(micro_internship_controller.router)
app.include_router(micro_internship_application_controller.router)
