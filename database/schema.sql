-- ============================================================
-- SkillBridge SA
-- Database Schema
-- MySQL 8.0+
-- ============================================================

-- Create database
CREATE DATABASE IF NOT EXISTS skillbridge_sa
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE skillbridge_sa;


-- ============================================================
-- RESET TABLES
-- ============================================================

SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS notifications;
DROP TABLE IF EXISTS micro_internship_applications;
DROP TABLE IF EXISTS micro_internship_skills;
DROP TABLE IF EXISTS micro_internships;
DROP TABLE IF EXISTS skill_gap_recommendations;
DROP TABLE IF EXISTS career_pathway_skills;
DROP TABLE IF EXISTS career_pathways;
DROP TABLE IF EXISTS applications;
DROP TABLE IF EXISTS opportunity_skills;
DROP TABLE IF EXISTS opportunities;
DROP TABLE IF EXISTS employers;
DROP TABLE IF EXISTS project_technologies;
DROP TABLE IF EXISTS projects;
DROP TABLE IF EXISTS experience;
DROP TABLE IF EXISTS certificates;
DROP TABLE IF EXISTS education;
DROP TABLE IF EXISTS candidate_skills;
DROP TABLE IF EXISTS skills;
DROP TABLE IF EXISTS candidate_profiles;
DROP TABLE IF EXISTS user_roles;
DROP TABLE IF EXISTS roles;
DROP TABLE IF EXISTS users;

SET FOREIGN_KEY_CHECKS = 1;


-- ============================================================
-- 1. USERS
-- ============================================================

CREATE TABLE users (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

    first_name VARCHAR(100) NOT NULL,

    last_name VARCHAR(100) NOT NULL,

    email VARCHAR(255) NOT NULL UNIQUE,

    password_hash VARCHAR(255) NOT NULL,

    phone VARCHAR(30),

    account_status ENUM(
        'ACTIVE',
        'INACTIVE',
        'SUSPENDED',
        'PENDING'
    ) NOT NULL DEFAULT 'ACTIVE',

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    INDEX idx_users_email (email),

    INDEX idx_users_status (account_status)
);


-- ============================================================
-- 2. ROLES
-- ============================================================

CREATE TABLE roles (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

    name VARCHAR(50) NOT NULL UNIQUE,

    description VARCHAR(255),

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);


-- ============================================================
-- 3. USER ROLES
-- ============================================================

CREATE TABLE user_roles (
    user_id BIGINT UNSIGNED NOT NULL,

    role_id BIGINT UNSIGNED NOT NULL,

    PRIMARY KEY (user_id, role_id),

    CONSTRAINT fk_user_roles_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_user_roles_role
        FOREIGN KEY (role_id)
        REFERENCES roles(id)
        ON DELETE CASCADE
);


-- ============================================================
-- 4. CANDIDATE PROFILES
-- ============================================================

CREATE TABLE candidate_profiles (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

    user_id BIGINT UNSIGNED NOT NULL UNIQUE,

    date_of_birth DATE,

    province VARCHAR(100),

    city VARCHAR(100),

    location VARCHAR(255),

    bio TEXT,

    career_goal VARCHAR(255),

    github_url VARCHAR(500),

    portfolio_url VARCHAR(500),

    profile_photo_url VARCHAR(500),

    profile_completion TINYINT UNSIGNED NOT NULL DEFAULT 0,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT chk_candidate_profile_completion
        CHECK (profile_completion BETWEEN 0 AND 100),

    CONSTRAINT fk_candidate_profile_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE,

    INDEX idx_candidate_location (province, city),

    INDEX idx_candidate_user (user_id)
);


-- ============================================================
-- 5. SKILLS
-- ============================================================

CREATE TABLE skills (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

    name VARCHAR(150) NOT NULL UNIQUE,

    category VARCHAR(100),

    description TEXT,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    INDEX idx_skills_category (category)
);


-- ============================================================
-- 6. CANDIDATE SKILLS
-- ============================================================

CREATE TABLE candidate_skills (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

    candidate_id BIGINT UNSIGNED NOT NULL,

    skill_id BIGINT UNSIGNED NOT NULL,

    proficiency ENUM(
        'BEGINNER',
        'INTERMEDIATE',
        'ADVANCED'
    ) NOT NULL DEFAULT 'BEGINNER',

    years_experience DECIMAL(4,1) NOT NULL DEFAULT 0.0,

    verified BOOLEAN NOT NULL DEFAULT FALSE,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    UNIQUE KEY uq_candidate_skill (
        candidate_id,
        skill_id
    ),

    CONSTRAINT chk_candidate_skill_experience
        CHECK (years_experience >= 0),

    CONSTRAINT fk_candidate_skills_candidate
        FOREIGN KEY (candidate_id)
        REFERENCES candidate_profiles(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_candidate_skills_skill
        FOREIGN KEY (skill_id)
        REFERENCES skills(id)
        ON DELETE RESTRICT,

    INDEX idx_candidate_skills_candidate (candidate_id),

    INDEX idx_candidate_skills_skill (skill_id)
);


-- ============================================================
-- 7. EDUCATION
-- ============================================================

CREATE TABLE education (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

    candidate_id BIGINT UNSIGNED NOT NULL,

    qualification VARCHAR(255) NOT NULL,

    institution VARCHAR(255) NOT NULL,

    field_of_study VARCHAR(255),

    nqf_level TINYINT UNSIGNED,

    start_date DATE,

    completion_date DATE,

    verified BOOLEAN NOT NULL DEFAULT FALSE,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT chk_education_nqf
        CHECK (
            nqf_level IS NULL
            OR nqf_level BETWEEN 1 AND 10
        ),

    CONSTRAINT chk_education_dates
        CHECK (
            completion_date IS NULL
            OR start_date IS NULL
            OR completion_date >= start_date
        ),

    CONSTRAINT fk_education_candidate
        FOREIGN KEY (candidate_id)
        REFERENCES candidate_profiles(id)
        ON DELETE CASCADE,

    INDEX idx_education_candidate (candidate_id),

    INDEX idx_education_nqf (nqf_level)
);


-- ============================================================
-- 8. CERTIFICATES
-- ============================================================

CREATE TABLE certificates (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

    candidate_id BIGINT UNSIGNED NOT NULL,

    name VARCHAR(255) NOT NULL,

    provider VARCHAR(255),

    issue_date DATE,

    credential_url VARCHAR(500),

    document_url VARCHAR(500),

    verified BOOLEAN NOT NULL DEFAULT FALSE,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_certificates_candidate
        FOREIGN KEY (candidate_id)
        REFERENCES candidate_profiles(id)
        ON DELETE CASCADE,

    INDEX idx_certificates_candidate (candidate_id)
);


-- ============================================================
-- 9. EXPERIENCE
-- ============================================================

CREATE TABLE experience (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

    candidate_id BIGINT UNSIGNED NOT NULL,

    title VARCHAR(255) NOT NULL,

    company VARCHAR(255),

    experience_type ENUM(
        'EMPLOYMENT',
        'INTERNSHIP',
        'FREELANCE',
        'VOLUNTEER',
        'INFORMAL',
        'PROJECT'
    ) NOT NULL DEFAULT 'EMPLOYMENT',

    description TEXT,

    start_date DATE,

    end_date DATE,

    currently_working BOOLEAN NOT NULL DEFAULT FALSE,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT chk_experience_dates
        CHECK (
            end_date IS NULL
            OR start_date IS NULL
            OR end_date >= start_date
        ),

    CONSTRAINT fk_experience_candidate
        FOREIGN KEY (candidate_id)
        REFERENCES candidate_profiles(id)
        ON DELETE CASCADE,

    INDEX idx_experience_candidate (candidate_id),

    INDEX idx_experience_type (experience_type)
);


-- ============================================================
-- 10. PROJECTS
-- ============================================================

CREATE TABLE projects (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

    candidate_id BIGINT UNSIGNED NOT NULL,

    name VARCHAR(255) NOT NULL,

    description TEXT,

    github_url VARCHAR(500),

    demo_url VARCHAR(500),

    project_date DATE,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_projects_candidate
        FOREIGN KEY (candidate_id)
        REFERENCES candidate_profiles(id)
        ON DELETE CASCADE,

    INDEX idx_projects_candidate (candidate_id)
);


-- ============================================================
-- 11. PROJECT TECHNOLOGIES
-- ============================================================

CREATE TABLE project_technologies (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

    project_id BIGINT UNSIGNED NOT NULL,

    technology VARCHAR(150) NOT NULL,

    UNIQUE KEY uq_project_technology (
        project_id,
        technology
    ),

    CONSTRAINT fk_project_technologies_project
        FOREIGN KEY (project_id)
        REFERENCES projects(id)
        ON DELETE CASCADE,

    INDEX idx_project_technologies_project (project_id)
);


-- ============================================================
-- 12. EMPLOYERS
-- ============================================================

CREATE TABLE employers (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

    user_id BIGINT UNSIGNED NOT NULL UNIQUE,

    company_name VARCHAR(255) NOT NULL,

    industry VARCHAR(150),

    description TEXT,

    location VARCHAR(255),

    website VARCHAR(500),

    company_size VARCHAR(100),

    verified BOOLEAN NOT NULL DEFAULT FALSE,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_employers_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE,

    INDEX idx_employers_company_name (company_name),

    INDEX idx_employers_industry (industry)
);


-- ============================================================
-- 13. OPPORTUNITIES
-- ============================================================

CREATE TABLE opportunities (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

    employer_id BIGINT UNSIGNED NOT NULL,

    title VARCHAR(255) NOT NULL,

    description TEXT NOT NULL,

    opportunity_type ENUM(
        'FULL_TIME',
        'PART_TIME',
        'INTERNSHIP',
        'CONTRACT',
        'MICRO_INTERNSHIP'
    ) NOT NULL,

    location VARCHAR(255),

    work_mode ENUM(
        'REMOTE',
        'ON_SITE',
        'HYBRID'
    ) NOT NULL DEFAULT 'ON_SITE',

    minimum_nqf TINYINT UNSIGNED,

    minimum_years_experience DECIMAL(4,1) NOT NULL DEFAULT 0.0,

    deadline DATE,

    status ENUM(
        'DRAFT',
        'PUBLISHED',
        'CLOSED'
    ) NOT NULL DEFAULT 'DRAFT',

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT chk_opportunity_nqf
        CHECK (
            minimum_nqf IS NULL
            OR minimum_nqf BETWEEN 1 AND 10
        ),

    CONSTRAINT chk_opportunity_experience
        CHECK (minimum_years_experience >= 0),

    CONSTRAINT fk_opportunities_employer
        FOREIGN KEY (employer_id)
        REFERENCES employers(id)
        ON DELETE CASCADE,

    INDEX idx_opportunities_employer (employer_id),

    INDEX idx_opportunities_status (status),

    INDEX idx_opportunities_type (opportunity_type),

    INDEX idx_opportunities_work_mode (work_mode),

    INDEX idx_opportunities_deadline (deadline)
);


-- ============================================================
-- 14. OPPORTUNITY SKILLS
-- ============================================================

CREATE TABLE opportunity_skills (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

    opportunity_id BIGINT UNSIGNED NOT NULL,

    skill_id BIGINT UNSIGNED NOT NULL,

    importance ENUM(
        'REQUIRED',
        'PREFERRED'
    ) NOT NULL DEFAULT 'REQUIRED',

    minimum_proficiency ENUM(
        'BEGINNER',
        'INTERMEDIATE',
        'ADVANCED'
    ) NOT NULL DEFAULT 'BEGINNER',

    UNIQUE KEY uq_opportunity_skill (
        opportunity_id,
        skill_id
    ),

    CONSTRAINT fk_opportunity_skills_opportunity
        FOREIGN KEY (opportunity_id)
        REFERENCES opportunities(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_opportunity_skills_skill
        FOREIGN KEY (skill_id)
        REFERENCES skills(id)
        ON DELETE RESTRICT,

    INDEX idx_opportunity_skills_opportunity (opportunity_id),

    INDEX idx_opportunity_skills_skill (skill_id)
);


-- ============================================================
-- 15. APPLICATIONS
-- ============================================================

CREATE TABLE applications (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

    candidate_id BIGINT UNSIGNED NOT NULL,

    opportunity_id BIGINT UNSIGNED NOT NULL,

    match_percentage DECIMAL(5,2) NOT NULL DEFAULT 0.00,

    status ENUM(
        'SUBMITTED',
        'UNDER_REVIEW',
        'SHORTLISTED',
        'INTERVIEW',
        'ACCEPTED',
        'REJECTED',
        'WITHDRAWN'
    ) NOT NULL DEFAULT 'SUBMITTED',

    cover_note TEXT,

    applied_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    UNIQUE KEY uq_candidate_opportunity (
        candidate_id,
        opportunity_id
    ),

    CONSTRAINT chk_application_match
        CHECK (
            match_percentage BETWEEN 0 AND 100
        ),

    CONSTRAINT fk_applications_candidate
        FOREIGN KEY (candidate_id)
        REFERENCES candidate_profiles(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_applications_opportunity
        FOREIGN KEY (opportunity_id)
        REFERENCES opportunities(id)
        ON DELETE CASCADE,

    INDEX idx_applications_candidate (candidate_id),

    INDEX idx_applications_opportunity (opportunity_id),

    INDEX idx_applications_status (status)
);


-- ============================================================
-- 16. CAREER PATHWAYS
-- ============================================================

CREATE TABLE career_pathways (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

    name VARCHAR(255) NOT NULL UNIQUE,

    description TEXT,

    industry VARCHAR(150),

    minimum_nqf TINYINT UNSIGNED,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT chk_career_pathway_nqf
        CHECK (
            minimum_nqf IS NULL
            OR minimum_nqf BETWEEN 1 AND 10
        ),

    INDEX idx_career_pathways_industry (industry)
);


-- ============================================================
-- 17. CAREER PATHWAY SKILLS
-- ============================================================

CREATE TABLE career_pathway_skills (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

    career_pathway_id BIGINT UNSIGNED NOT NULL,

    skill_id BIGINT UNSIGNED NOT NULL,

    importance ENUM(
        'REQUIRED',
        'PREFERRED'
    ) NOT NULL DEFAULT 'REQUIRED',

    UNIQUE KEY uq_career_pathway_skill (
        career_pathway_id,
        skill_id
    ),

    CONSTRAINT fk_career_pathway_skills_pathway
        FOREIGN KEY (career_pathway_id)
        REFERENCES career_pathways(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_career_pathway_skills_skill
        FOREIGN KEY (skill_id)
        REFERENCES skills(id)
        ON DELETE RESTRICT,

    INDEX idx_career_pathway_skills_pathway (
        career_pathway_id
    ),

    INDEX idx_career_pathway_skills_skill (
        skill_id
    )
);


-- ============================================================
-- 18. SKILL GAP RECOMMENDATIONS
-- ============================================================

CREATE TABLE skill_gap_recommendations (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

    candidate_id BIGINT UNSIGNED NOT NULL,

    career_pathway_id BIGINT UNSIGNED NOT NULL,

    skill_id BIGINT UNSIGNED NOT NULL,

    reason TEXT,

    priority ENUM(
        'LOW',
        'MEDIUM',
        'HIGH'
    ) NOT NULL DEFAULT 'MEDIUM',

    status ENUM(
        'OPEN',
        'IN_PROGRESS',
        'COMPLETED',
        'DISMISSED'
    ) NOT NULL DEFAULT 'OPEN',

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    UNIQUE KEY uq_skill_gap (
        candidate_id,
        career_pathway_id,
        skill_id
    ),

    CONSTRAINT fk_skill_gap_candidate
        FOREIGN KEY (candidate_id)
        REFERENCES candidate_profiles(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_skill_gap_pathway
        FOREIGN KEY (career_pathway_id)
        REFERENCES career_pathways(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_skill_gap_skill
        FOREIGN KEY (skill_id)
        REFERENCES skills(id)
        ON DELETE RESTRICT,

    INDEX idx_skill_gap_candidate (candidate_id),

    INDEX idx_skill_gap_pathway (career_pathway_id),

    INDEX idx_skill_gap_status (status),

    INDEX idx_skill_gap_priority (priority)
);


-- ============================================================
-- 19. MICRO-INTERNSHIPS
-- ============================================================

CREATE TABLE micro_internships (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

    employer_id BIGINT UNSIGNED NOT NULL,

    title VARCHAR(255) NOT NULL,

    description TEXT NOT NULL,

    duration_days INT UNSIGNED NOT NULL,

    location VARCHAR(255),

    work_mode ENUM(
        'REMOTE',
        'ON_SITE',
        'HYBRID'
    ) NOT NULL DEFAULT 'REMOTE',

    status ENUM(
        'DRAFT',
        'PUBLISHED',
        'CLOSED'
    ) NOT NULL DEFAULT 'DRAFT',

    deadline DATE,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT chk_micro_internship_duration
        CHECK (duration_days > 0),

    CONSTRAINT fk_micro_internships_employer
        FOREIGN KEY (employer_id)
        REFERENCES employers(id)
        ON DELETE CASCADE,

    INDEX idx_micro_internships_employer (employer_id),

    INDEX idx_micro_internships_status (status),

    INDEX idx_micro_internships_deadline (deadline)
);


-- ============================================================
-- 20. MICRO-INTERNSHIP SKILLS
-- ============================================================

CREATE TABLE micro_internship_skills (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

    micro_internship_id BIGINT UNSIGNED NOT NULL,

    skill_id BIGINT UNSIGNED NOT NULL,

    UNIQUE KEY uq_micro_internship_skill (
        micro_internship_id,
        skill_id
    ),

    CONSTRAINT fk_micro_internship_skills_internship
        FOREIGN KEY (micro_internship_id)
        REFERENCES micro_internships(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_micro_internship_skills_skill
        FOREIGN KEY (skill_id)
        REFERENCES skills(id)
        ON DELETE RESTRICT,

    INDEX idx_micro_internship_skills_internship (
        micro_internship_id
    ),

    INDEX idx_micro_internship_skills_skill (
        skill_id
    )
);


-- ============================================================
-- 21. MICRO-INTERNSHIP APPLICATIONS
-- ============================================================

CREATE TABLE micro_internship_applications (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

    micro_internship_id BIGINT UNSIGNED NOT NULL,

    candidate_id BIGINT UNSIGNED NOT NULL,

    match_percentage DECIMAL(5,2) NOT NULL DEFAULT 0.00,

    status ENUM(
        'APPLIED',
        'SHORTLISTED',
        'ACCEPTED',
        'IN_PROGRESS',
        'COMPLETED',
        'REJECTED',
        'WITHDRAWN'
    ) NOT NULL DEFAULT 'APPLIED',

    feedback TEXT,

    submitted_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    started_at TIMESTAMP NULL,

    completed_at TIMESTAMP NULL,

    UNIQUE KEY uq_micro_internship_candidate (
        micro_internship_id,
        candidate_id
    ),

    CONSTRAINT chk_micro_application_match
        CHECK (
            match_percentage BETWEEN 0 AND 100
        ),

    CONSTRAINT chk_micro_application_dates
        CHECK (
            completed_at IS NULL
            OR started_at IS NULL
            OR completed_at >= started_at
        ),

    CONSTRAINT fk_micro_application_internship
        FOREIGN KEY (micro_internship_id)
        REFERENCES micro_internships(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_micro_application_candidate
        FOREIGN KEY (candidate_id)
        REFERENCES candidate_profiles(id)
        ON DELETE CASCADE,

    INDEX idx_micro_applications_internship (
        micro_internship_id
    ),

    INDEX idx_micro_applications_candidate (
        candidate_id
    ),

    INDEX idx_micro_applications_status (
        status
    )
);


-- ============================================================
-- 22. NOTIFICATIONS
-- ============================================================

CREATE TABLE notifications (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

    user_id BIGINT UNSIGNED NOT NULL,

    title VARCHAR(255) NOT NULL,

    message TEXT NOT NULL,

    type VARCHAR(100),

    is_read BOOLEAN NOT NULL DEFAULT FALSE,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_notifications_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE,

    INDEX idx_notifications_user (user_id),

    INDEX idx_notifications_read (is_read),

    INDEX idx_notifications_created (created_at)
);


-- ============================================================
-- INITIAL ROLES
-- ============================================================

INSERT INTO roles (name, description)
VALUES
    ('CANDIDATE', 'Job seeker, learner or young professional'),
    ('EMPLOYER', 'Organisation offering jobs, internships or projects'),
    ('ADMIN', 'System administrator');


-- ============================================================
-- DATABASE VERIFICATION
-- ============================================================

SELECT
    TABLE_NAME
FROM
    information_schema.TABLES
WHERE
    TABLE_SCHEMA = 'skillbridge_sa'
ORDER BY
    TABLE_NAME;
