-- ============================================================
-- SkillBridge SA
-- Seed Data
-- MySQL 8.0+
-- ============================================================

USE skillbridge_sa;


-- ============================================================
-- 1. ROLES
-- ============================================================

INSERT INTO roles (name, description)
VALUES
    ('CANDIDATE', 'Job seeker, learner or young professional'),
    ('EMPLOYER', 'Organisation offering jobs, internships or projects'),
    ('ADMIN', 'System administrator')
ON DUPLICATE KEY UPDATE
    description = VALUES(description);


-- ============================================================
-- 2. SKILLS
-- ============================================================

INSERT INTO skills (name, category, description)
VALUES

-- Programming
('Python', 'Programming', 'Programming language used for backend development, automation and data applications'),
('Java', 'Programming', 'Object-oriented programming language widely used for enterprise applications'),
('JavaScript', 'Programming', 'Programming language commonly used for web applications'),
('C#', 'Programming', 'Programming language used for application and software development'),

-- Web Development
('HTML', 'Web Development', 'Markup language used to structure web pages'),
('CSS', 'Web Development', 'Styling language used to design web interfaces'),
('React', 'Web Development', 'JavaScript library for building user interfaces'),
('Angular', 'Web Development', 'Framework for building web applications'),
('Vite', 'Web Development', 'Frontend build tool for modern web applications'),

-- Backend
('FastAPI', 'Backend Development', 'Python web framework for building APIs'),
('Spring Boot', 'Backend Development', 'Java framework for building backend applications'),
('REST API', 'Backend Development', 'Architectural approach for building web APIs'),

-- Databases
('MySQL', 'Database', 'Relational database management system'),
('SQL', 'Database', 'Language for managing and querying relational databases'),
('Database Management', 'Database', 'Skills for designing, managing and maintaining databases'),

-- Software Engineering
('Git', 'Software Engineering', 'Version control system for tracking source code changes'),
('GitHub', 'Software Engineering', 'Platform for hosting and collaborating on software projects'),
('Object-Oriented Programming', 'Software Engineering', 'Programming approach based on objects and classes'),
('Software Testing', 'Software Engineering', 'Processes and techniques used to verify software quality'),
('Unit Testing', 'Software Engineering', 'Testing individual components of an application'),

-- Cloud / DevOps
('AWS', 'Cloud', 'Amazon Web Services cloud computing platform'),
('Docker', 'DevOps', 'Platform for containerising applications'),
('CI/CD', 'DevOps', 'Practices for continuous integration and continuous delivery'),

-- Data
('Data Analysis', 'Data', 'Process of analysing data to discover useful insights'),
('Data Entry', 'Data', 'Accurate capturing and processing of information'),
('Microsoft Excel', 'Data', 'Spreadsheet application used for data management and analysis'),
('Power BI', 'Data', 'Business intelligence and data visualisation platform'),

-- Design
('UI Design', 'Design', 'Design of user interfaces for digital products'),
('UX Design', 'Design', 'Design of user experiences for digital products'),
('Figma', 'Design', 'Collaborative interface design and prototyping tool'),

-- Professional
('Communication', 'Professional', 'Ability to communicate information clearly and effectively'),
('Customer Service', 'Professional', 'Skills for assisting customers and resolving customer needs'),
('Problem Solving', 'Professional', 'Ability to identify problems and develop practical solutions'),
('Teamwork', 'Professional', 'Ability to collaborate effectively with others'),
('Time Management', 'Professional', 'Ability to organise tasks and meet deadlines'),
('Attention to Detail', 'Professional', 'Ability to identify errors and maintain accuracy'),
('Critical Thinking', 'Professional', 'Ability to analyse information and make reasoned decisions'),
('Research', 'Professional', 'Ability to gather, evaluate and interpret information'),

-- Business
('Entrepreneurship', 'Business', 'Skills involved in creating and developing business opportunities'),
('Business Analysis', 'Business', 'Analysis of business needs and processes'),
('Project Management', 'Business', 'Planning and managing projects to achieve defined objectives'),
('Digital Marketing', 'Business', 'Marketing products and services through digital channels');



-- ============================================================
-- 3. CAREER PATHWAYS
-- ============================================================

INSERT INTO career_pathways
    (name, description, industry, minimum_nqf)
VALUES

(
    'Junior Software Developer',
    'Entry-level software development pathway focused on programming, databases, APIs, testing and software projects.',
    'Information Technology',
    4
),

(
    'Frontend Developer',
    'Career pathway focused on creating responsive and interactive web interfaces.',
    'Information Technology',
    4
),

(
    'Backend Developer',
    'Career pathway focused on server-side applications, APIs, databases and business logic.',
    'Information Technology',
    4
),

(
    'Full Stack Developer',
    'Career pathway combining frontend and backend web development.',
    'Information Technology',
    4
),

(
    'Data Analyst',
    'Career pathway focused on collecting, cleaning, analysing and presenting data.',
    'Data and Analytics',
    4
),

(
    'UI/UX Designer',
    'Career pathway focused on user research, interface design, prototyping and user experience.',
    'Design and Technology',
    4
),

(
    'IT Support Specialist',
    'Career pathway focused on technical support, troubleshooting, systems and customer assistance.',
    'Information Technology',
    4
),

(
    'Business Analyst',
    'Career pathway focused on understanding business requirements, processes and technology solutions.',
    'Business and Technology',
    5
),

(
    'Digital Entrepreneur',
    'Career pathway focused on creating and growing technology-enabled businesses.',
    'Entrepreneurship',
    4
);



-- ============================================================
-- 4. CAREER PATHWAY SKILLS
-- ============================================================

-- ------------------------------------------------------------
-- Junior Software Developer
-- ------------------------------------------------------------

INSERT INTO career_pathway_skills
    (career_pathway_id, skill_id, importance)
SELECT
    cp.id,
    s.id,
    'REQUIRED'
FROM career_pathways cp
JOIN skills s
WHERE cp.name = 'Junior Software Developer'
AND s.name IN (
    'Python',
    'Java',
    'JavaScript',
    'SQL',
    'Git',
    'GitHub',
    'Object-Oriented Programming',
    'Software Testing',
    'Problem Solving'
);


INSERT INTO career_pathway_skills
    (career_pathway_id, skill_id, importance)
SELECT
    cp.id,
    s.id,
    'PREFERRED'
FROM career_pathways cp
JOIN skills s
WHERE cp.name = 'Junior Software Developer'
AND s.name IN (
    'MySQL',
    'REST API',
    'Docker',
    'AWS',
    'Communication'
);


-- ------------------------------------------------------------
-- Frontend Developer
-- ------------------------------------------------------------

INSERT INTO career_pathway_skills
    (career_pathway_id, skill_id, importance)
SELECT
    cp.id,
    s.id,
    'REQUIRED'
FROM career_pathways cp
JOIN skills s
WHERE cp.name = 'Frontend Developer'
AND s.name IN (
    'HTML',
    'CSS',
    'JavaScript',
    'React',
    'Git',
    'GitHub',
    'UI Design'
);


INSERT INTO career_pathway_skills
    (career_pathway_id, skill_id, importance)
SELECT
    cp.id,
    s.id,
    'PREFERRED'
FROM career_pathways cp
JOIN skills s
WHERE cp.name = 'Frontend Developer'
AND s.name IN (
    'Angular',
    'Vite',
    'UX Design',
    'Figma',
    'REST API'
);


-- ------------------------------------------------------------
-- Backend Developer
-- ------------------------------------------------------------

INSERT INTO career_pathway_skills
    (career_pathway_id, skill_id, importance)
SELECT
    cp.id,
    s.id,
    'REQUIRED'
FROM career_pathways cp
JOIN skills s
WHERE cp.name = 'Backend Developer'
AND s.name IN (
    'Python',
    'FastAPI',
    'SQL',
    'MySQL',
    'REST API',
    'Git',
    'GitHub',
    'Problem Solving'
);


INSERT INTO career_pathway_skills
    (career_pathway_id, skill_id, importance)
SELECT
    cp.id,
    s.id,
    'PREFERRED'
FROM career_pathways cp
JOIN skills s
WHERE cp.name = 'Backend Developer'
AND s.name IN (
    'Docker',
    'AWS',
    'Unit Testing',
    'CI/CD'
);


-- ------------------------------------------------------------
-- Full Stack Developer
-- ------------------------------------------------------------

INSERT INTO career_pathway_skills
    (career_pathway_id, skill_id, importance)
SELECT
    cp.id,
    s.id,
    'REQUIRED'
FROM career_pathways cp
JOIN skills s
WHERE cp.name = 'Full Stack Developer'
AND s.name IN (
    'HTML',
    'CSS',
    'JavaScript',
    'React',
    'Python',
    'FastAPI',
    'SQL',
    'MySQL',
    'REST API',
    'Git',
    'GitHub',
    'Problem Solving'
);


INSERT INTO career_pathway_skills
    (career_pathway_id, skill_id, importance)
SELECT
    cp.id,
    s.id,
    'PREFERRED'
FROM career_pathways cp
JOIN skills s
WHERE cp.name = 'Full Stack Developer'
AND s.name IN (
    'Docker',
    'AWS',
    'Unit Testing',
    'CI/CD'
);


-- ------------------------------------------------------------
-- Data Analyst
-- ------------------------------------------------------------

INSERT INTO career_pathway_skills
    (career_pathway_id, skill_id, importance)
SELECT
    cp.id,
    s.id,
    'REQUIRED'
FROM career_pathways cp
JOIN skills s
WHERE cp.name = 'Data Analyst'
AND s.name IN (
    'SQL',
    'Microsoft Excel',
    'Data Analysis',
    'Data Entry',
    'Critical Thinking',
    'Attention to Detail'
);


INSERT INTO career_pathway_skills
    (career_pathway_id, skill_id, importance)
SELECT
    cp.id,
    s.id,
    'PREFERRED'
FROM career_pathways cp
JOIN skills s
WHERE cp.name = 'Data Analyst'
AND s.name IN (
    'Power BI',
    'Python',
    'MySQL',
    'Research'
);


-- ------------------------------------------------------------
-- UI/UX Designer
-- ------------------------------------------------------------

INSERT INTO career_pathway_skills
    (career_pathway_id, skill_id, importance)
SELECT
    cp.id,
    s.id,
    'REQUIRED'
FROM career_pathways cp
JOIN skills s
WHERE cp.name = 'UI/UX Designer'
AND s.name IN (
    'UI Design',
    'UX Design',
    'Figma',
    'Communication',
    'Research',
    'Critical Thinking'
);


INSERT INTO career_pathway_skills
    (career_pathway_id, skill_id, importance)
SELECT
    cp.id,
    s.id,
    'PREFERRED'
FROM career_pathways cp
JOIN skills s
WHERE cp.name = 'UI/UX Designer'
AND s.name IN (
    'HTML',
    'CSS',
    'JavaScript'
);


-- ------------------------------------------------------------
-- IT Support Specialist
-- ------------------------------------------------------------

INSERT INTO career_pathway_skills
    (career_pathway_id, skill_id, importance)
SELECT
    cp.id,
    s.id,
    'REQUIRED'
FROM career_pathways cp
JOIN skills s
WHERE cp.name = 'IT Support Specialist'
AND s.name IN (
    'Customer Service',
    'Problem Solving',
    'Communication',
    'Attention to Detail'
);


INSERT INTO career_pathway_skills
    (career_pathway_id, skill_id, importance)
SELECT
    cp.id,
    s.id,
    'PREFERRED'
FROM career_pathways cp
JOIN skills s
WHERE cp.name = 'IT Support Specialist'
AND s.name IN (
    'Microsoft Excel',
    'Database Management',
    'SQL',
    'Research'
);


-- ------------------------------------------------------------
-- Business Analyst
-- ------------------------------------------------------------

INSERT INTO career_pathway_skills
    (career_pathway_id, skill_id, importance)
SELECT
    cp.id,
    s.id,
    'REQUIRED'
FROM career_pathways cp
JOIN skills s
WHERE cp.name = 'Business Analyst'
AND s.name IN (
    'Business Analysis',
    'SQL',
    'Data Analysis',
    'Communication',
    'Critical Thinking',
    'Problem Solving'
);


INSERT INTO career_pathway_skills
    (career_pathway_id, skill_id, importance)
SELECT
    cp.id,
    s.id,
    'PREFERRED'
FROM career_pathways cp
JOIN skills s
WHERE cp.name = 'Business Analyst'
AND s.name IN (
    'Microsoft Excel',
    'Power BI',
    'Project Management',
    'Research'
);


-- ------------------------------------------------------------
-- Digital Entrepreneur
-- ------------------------------------------------------------

INSERT INTO career_pathway_skills
    (career_pathway_id, skill_id, importance)
SELECT
    cp.id,
    s.id,
    'REQUIRED'
FROM career_pathways cp
JOIN skills s
WHERE cp.name = 'Digital Entrepreneur'
AND s.name IN (
    'Entrepreneurship',
    'Communication',
    'Problem Solving',
    'Digital Marketing',
    'Project Management'
);


INSERT INTO career_pathway_skills
    (career_pathway_id, skill_id, importance)
SELECT
    cp.id,
    s.id,
    'PREFERRED'
FROM career_pathways cp
JOIN skills s
WHERE cp.name = 'Digital Entrepreneur'
AND s.name IN (
    'Business Analysis',
    'UI Design',
    'UX Design',
    'Data Analysis'
);



-- ============================================================
-- 5. DEMO EMPLOYER USERS
-- ============================================================
--
-- These are development/demo accounts only.
-- Passwords will later be replaced by properly generated
-- password hashes when the FastAPI authentication system is built.
--
-- We are NOT creating login accounts here yet.
-- The backend registration system will handle real users.
--
-- Therefore, no demo users are inserted at this stage.
-- ============================================================



-- ============================================================
-- 6. VERIFY SEED DATA
-- ============================================================

SELECT
    'Roles' AS data_type,
    COUNT(*) AS total
FROM roles

UNION ALL

SELECT
    'Skills',
    COUNT(*)
FROM skills

UNION ALL

SELECT
    'Career Pathways',
    COUNT(*)
FROM career_pathways

UNION ALL

SELECT
    'Career Pathway Skills',
    COUNT(*)
FROM career_pathway_skills;


-- ============================================================
-- END OF SEED DATA
-- ============================================================