DROP TABLE Enrolment;
DROP TABLE Curriculum;
DROP TABLE CourseRegistration;
DROP TABLE CourseClass;
DROP TABLE CourseRequirement;
DROP TABLE Course;
DROP TABLE StudentClass;
DROP TABLE Class;
DROP TABLE Account;
DROP TABLE Semester;

CREATE TABLE Semester (
       current_s CHAR(5),
       s_time CHAR(10)
);

CREATE TABLE Account (
       username VARCHAR(50) UNIQUE,
       password VARCHAR(20),
       role VARCHAR(10),
       id CHAR(8) UNIQUE,
       first_name VARCHAR(20),
       last_name VARCHAR(20),
       gender CHAR(6),
       CONSTRAINT pk_account_username PRIMARY KEY (username, id)
);

CREATE TABLE Class (
       class_id CHAR(10),
       class_name VARCHAR(40),
       class_type CHAR(10),
       CONSTRAINT pk_class PRIMARY KEY (class_id)
);

CREATE TABLE StudentClass (
       student_id CHAR(8),
       class_id CHAR(10),
       CONSTRAINT fk_student_class FOREIGN KEY (class_id) REFERENCES Class(class_id)
);

CREATE TABLE Course (
       course_id CHAR(10),
       course_name VARCHAR(100),
       credit INT,
       progress_weight FLOAT,
       CONSTRAINT pk_course PRIMARY KEY (course_id)
);

CREATE TABLE CourseRequirement (
       course_id CHAR(10),
       require_id CHAR(10)
);

CREATE TABLE Curriculum (
       class_id CHAR(10),
       course_id CHAR(10),
       CONSTRAINT pk_curriculum PRIMARY KEY (class_id, course_id),
       CONSTRAINT fk_curriculum_class FOREIGN KEY (class_id) REFERENCES Class(class_id),
       CONSTRAINT fk_curriculem_course FOREIGN KEY (course_id) REFERENCES Course(course_id)
);

CREATE TABLE CourseRegistration (
       course_id CHAR(10),
       semester CHAR(5),
       student_id CHAR(8),
       CONSTRAINT fk_reg_course_cid FOREIGN KEY (course_id) REFERENCES Course(course_id)
);

CREATE TABLE CourseClass (
       class_id CHAR(6),
       course_id CHAR(10),
       semester CHAR(5),
       teacher_id CHAR(8),
       class_day CHAR(10),
       start_time TIME,
       end_time TIME,
       CONSTRAINT pk_course_class PRIMARY KEY (class_id, semester),
       CONSTRAINT fk_course_class_course FOREIGN KEY (course_id) REFERENCES Course(course_id)
);

CREATE TABLE Enrolment (
       student_id CHAR(8),
       class_id CHAR(6),
       semester CHAR(5),
       midterm_score FLOAT,
       final_score FLOAT,
       CONSTRAINT pk_enrolment PRIMARY KEY (student_id, class_id, semester),
       CONSTRAINT fk_enrolment_course_class FOREIGN KEY (class_id, semester) REFERENCES CourseClass(class_id, semester)
);
