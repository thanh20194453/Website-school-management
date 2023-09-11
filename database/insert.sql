INSERT INTO Semester
       (current_s, s_time)
       VALUES
       ('20212', 'COURSE');

INSERT INTO Account
       (username, password, role, first_name, last_name, id, gender)
       VALUES
       ('admin', '123', 'ADMIN', null, null, '1', 'MALE'),
       ('student1', '123', 'STUDENT', 'N', 'Nguyen Van', '123145', 'MALE'),
       ('student2', '123', 'STUDENT', 'M', 'Nguyen Van', '123146', 'MALE'),
       ('student3', '123', 'STUDENT', 'P', 'Nguyen Thi', '123147', 'FEMALE'),
       ('teacher1', '123', 'TEACHER', 'A', 'Le van', '100101', 'MALE'),
       ('teacher2', '123', 'TEACHER', 'B', 'Nguyen Thi', '100104', 'FEMALE');

INSERT INTO Class
       (class_id, class_name, class_type)
       VALUES
       ('IT-E10', 'DS&AI', 'CREDIT'),
       ('IT-E9', 'NCLASS', 'NORMAL');

INSERT INTO StudentClass
       (student_id, class_id)
       VALUES
       ('123145', 'IT-E10'),
       ('123146', 'IT-E9'),
       ('123147', 'IT-E10');

INSERT INTO Course
       (course_id, course_name, credit, progress_weight)
       VALUES
       ('IT1110E', 'Nhập môn lập trình', 4, 0.7),
       ('IT2022E', 'Thống kê ứng dụng và phân tích thực nghiệm', 3, 0.5),
       ('IT3020E', 'Toán rời rạc', 3, 0.5),
       ('IT3052E', 'Tối ưu hóa', 3, 0.5),
       ('MI1111E', 'Giải tích I', 4, 0.5),
       ('MI1121E', 'Giải tích II', 3, 0.5),
       ('MI1131E', 'Giải tích III', 3, 0.5),
       ('MI1141E', 'Đại số', 4, 0.5),
       ('MI2020E', 'Xác suất thống kê', 2, 0.5),
       ('PH1110E', 'Vật lý đại cương', 3, 0.5),

       ('IT3010E', 'Cấu trúc dữ liệu và giải thuật', 3, 0.5),
       ('IT3030E', 'Kiến trúc máy tính', 3, 0.7),
       ('IT3070E', 'Nguyên lý hệ điều hành', 3, 0.7),
       ('IT3080E', 'Mạng máy tính', 3, 0.5),
       ('IT3090E', 'Cơ sở dữ liệu', 3, 0.5),
       ('IT3100E', 'Lập trình hướng đối tượng', 3, 0.5);

INSERT INTO CourseRequirement
       (course_id, require_id)
       VALUES
       ('IT3030E', 'IT3010E'),
       ('IT3070E', 'IT3010E'),
       ('IT3070E', 'IT3030E');

INSERT INTO CourseRegistration
       (course_id, semester, student_id)
       VALUES
       ('IT3010E', '20211', '123145'),
       ('IT3030E', '20211', '123145'),
       ('IT3070E', '20212', '123145'),
       ('IT3090E', '20212', '123145'),
       ('MI1141E', '20212', '123145'),
       ('MI1141E', '20212', '123146'),
       ('MI1141E', '20212', '123147');

INSERT INTO Curriculum
       (class_id, course_id)
       VALUES
       ('IT-E10', 'MI1141E'),
       ('IT-E10', 'IT3010E'),
       ('IT-E10', 'IT3030E'),
       ('IT-E10', 'IT3070E'),
       ('IT-E10', 'IT3080E'),
       ('IT-E10', 'IT3090E'),
       ('IT-E10', 'IT3100E'),

       ('IT-E9', 'MI1111E'),
       ('IT-E9', 'MI1121E'),
       ('IT-E9', 'MI1131E'),
       ('IT-E9', 'MI1141E');

INSERT INTO CourseClass
       (class_id, course_id, semester, teacher_id, class_day, start_time, end_time)
       VALUES
       ('123001', 'IT3010E', '20211', '100101', 'WEDNESDAY', '13:00:00', '13:30:00'),
       ('123002', 'IT3030E', '20211', '100104', 'FRIDAY', '14:00:00', '15:00:00'),
       
       ('123001', 'IT3010E', '20212', '100104', 'WEDNESDAY', '10:05:00', '11:45:00'),
       ('123002', 'IT3030E', '20212', '100104', 'FRIDAY', '10:05:00', '11:45:00'),
       ('123003', 'IT3070E', '20212', '100101', 'MONDAY', '14:00:00', '15:00:00'),
       ('123004', 'MI1141E', '20212', '100101', 'THURSDAY', '06:45:00', '08:20:00');

INSERT INTO Enrolment
       (student_id, class_id, semester, midterm_score, final_score)
       VALUES
       ('123145', '123001', '20211', 8.5, 9),
       ('123145', '123002', '20211', 9, 9),
       
       ('123145', '123003', '20212', null, null),
       ('123145', '123004', '20212', null, null),
       ('123146', '123004', '20212', null, null),
       ('123147', '123004', '20212', null, null);
