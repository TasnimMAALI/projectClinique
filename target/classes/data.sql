-- Default admin user
INSERT INTO users (email, password, first_name, last_name, role)
SELECT 'admin@clinique.com', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', 'Admin', 'System', 'ROLE_ADMIN'
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'admin@clinique.com');

-- Default doctor
INSERT INTO users (email, password, first_name, last_name, role, specialization, license_number)
SELECT 'doctor@clinique.com', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', 'John', 'Doe', 'ROLE_DOCTOR', 'General Medicine', 'LIC123'
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'doctor@clinique.com');

-- Default secretary
INSERT INTO users (email, password, first_name, last_name, role)
SELECT 'secretary@clinique.com', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', 'Jane', 'Smith', 'ROLE_SECRETARY'
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'secretary@clinique.com');

-- Default patient
INSERT INTO users (email, password, first_name, last_name, role)
SELECT 'patient@clinique.com', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', 'Bob', 'Patient', 'ROLE_PATIENT'
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'patient@clinique.com');
