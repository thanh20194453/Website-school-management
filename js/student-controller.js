module.exports = function(server, db) {
    server.get('/student/registered/list', (req, res) => {
        if (req.session.login && req.session.role === 'STUDENT') {
            db.query('SELECT Course.course_name, Course.course_id, Enrolment.class_id, CourseClass.class_day, CourseClass.start_time, CourseClass.end_time, Enrolment.midterm_score, Enrolment.final_score, Course.progress_weight FROM Enrolment JOIN (CourseClass, Course, Semester) ON (Enrolment.semester = Semester.current_s AND Enrolment.class_id = CourseClass.class_id AND Enrolment.semester = CourseClass.semester AND CourseClass.course_id = Course.course_id) WHERE Enrolment.student_id = ?', [req.session.user_id], (db_err, db_res, fields) => {
                res.send(db_res);
                res.end();
            });
        }
    });

    server.get('/student/register/registered-class', (req, res) => {
        if (req.session.login && req.session.role === 'STUDENT') {
            db.query('SELECT Course.course_name, Course.course_id, Enrolment.class_id, CourseClass.class_day, CourseClass.start_time, CourseClass.end_time FROM Enrolment JOIN (CourseClass, Course, Semester) ON (Enrolment.semester = Semester.current_s AND Enrolment.class_id = CourseClass.class_id AND Enrolment.semester = CourseClass.semester AND CourseClass.course_id = Course.course_id) WHERE Enrolment.student_id = ?', [req.session.user_id], (db_err, db_res, fields) => {
                res.send(db_res);
                res.end();
            });
        }
    });

    server.get('/student/register/registered-course', (req, res) => {
        if (req.session.login && req.session.role === 'STUDENT') {
            db.query('SELECT Course.* FROM CourseRegistration JOIN (Course, Semester) ON (CourseRegistration.semester = Semester.current_s AND CourseRegistration.course_id = Course.course_id) WHERE CourseRegistration.student_id = ?', [req.session.user_id], (db_err, db_res, fields) => {
                res.send(db_res);
                res.end();
            });
        }
    });

    server.post('/student/register-class/update', (req, res) => {
        if (req.session.login && req.session.role === 'STUDENT') {
            if (req.session.class_type === 'NORMAL') {
                res.send('Your curriculum does not allow you to register classes');
                res.end();
                return;
            }
            db.query('SELECT * FROM Semester', [], (sdb_err, sdb_res, sfields) => {
                let semester = sdb_res[0].current_s;
                let status = sdb_res[0].s_time;
                if (status !== 'CLASS') {
                    res.send('This is not the time for registering classes');
                    res.end();
                    return;
                }
                db.query('SELECT Course.course_name, Course.course_id, Enrolment.class_id, CourseClass.class_day, CourseClass.start_time, CourseClass.end_time FROM Enrolment JOIN (CourseClass, Course) ON (Enrolment.class_id = CourseClass.class_id AND Enrolment.semester = CourseClass.semester AND CourseClass.course_id = Course.course_id) WHERE Enrolment.semester = ? AND Enrolment.student_id = ?', [semester, req.session.user_id], (db_err, db_res, fields) => {                   
                    let ins = [], del = [];
                    let old = new Set(), new_ = new Set();
                    for (let i = 0, row; row = db_res[i]; i += 1) {
                        old.add(row.class_id);
                    }
                    for (let i = 0, row; row = req.body[i]; i += 1) {
                        new_.add(row[2]);
                        if (!old.has(row[2])) {
                            ins.push([req.session.user_id, row[2], semester]);
                        }
                    }
                    for (let i = 0, row; row = db_res[i]; i += 1) {
                        if (!new_.has(row.class_id)) {
                            del.push(row.class_id);
                        }
                    }
                    
                    for (let i = 0, len = req.body.length; i < len; i += 1) {
                        let row1 = req.body[i];
                        for (let j = i + 1; j < len; j += 1) {
                            let row2 = req.body[j];
                            if (row1[3] === row2[3]) {
                                if (row1[4] > row2[5] || row1[5] < row2[4]) {}
                                else {
                                    res.send('Time conflict between class ' + row1[2] + ' and class ' + row2[2]);
                                    res.end();
                                    return;
                                }
                            }
                        }
                    }
                    
                    ins_func = function (msg) {
                        db.query('INSERT INTO Enrolment (student_id, class_id, semester) VALUES ?', [ins], (db_err3, db_res3, fields3) => {
                            if (db_err3) console.log(db_res3);
                            res.send(msg);
                            res.end();
                        });
                    };
                    if (del.length > 0) {
                        db.query('DELETE FROM Enrolment WHERE student_id = ? AND semester = ? AND class_id IN ?', [req.session.user_id, semester, [del]], (db_err2, db_res2, fields2) => {
                            if (db_err2) console.log(db_res2);
                            if (ins.length > 0) {
                                ins_func('Registration sent');
                            } else {
                                res.send('Registration sent');
                                res.end();
                            }
                        });
                    } else if (ins.length > 0) {
                        ins_func('Registration sent');
                    } else {
                        res.send('Registration sent');
                        res.end();
                    }
                });
            });
        }
    });

    server.post('/student/register-course/update', (req, res) => {
        if (req.session.login && req.session.role === 'STUDENT') {
            if (req.session.class_type === 'NORMAL') {
                res.send('Your curriculum does not allow you to register courses');
                res.end();
                return;
            }
            db.query('SELECT * FROM Semester', [], (sdb_err, sdb_res, sfields) => {
                let semester = sdb_res[0].current_s;
                let status = sdb_res[0].s_time;
                if (status !== 'COURSE') {
                    res.send('This is not the time for registering courses');
                    res.end();
                    return;
                }
                db.query('SELECT course_id FROM CourseRegistration WHERE semester = ? AND student_id = ?', [semester, req.session.user_id], (db_err, db_res, fields) => {
                    let s1 = new Set();
                    let s2 = new Set();
                    for (let i = 0, row; row = db_res[i]; i += 1) {
                        s1.add(row.course_id);
                    }
                    for (let i = 0, val; val = req.body[i]; i += 1) {
                        if (!s1.has(val)) {
                            db.query('INSERT INTO CourseRegistration (course_id, semester, student_id) VALUES ?', [[[val, semester, req.session.user_id]]]);
                        }
                        s2.add(val);
                    }
                    for (let i = 0, row; row = db_res[i]; i += 1) {
                        if (!s2.has(row.course_id)) {
                            db.query('DELETE FROM CourseRegistration WHERE semester = ? AND student_id = ? AND course_id = ?', [semester, req.session.user_id, row.course_id]);
                        }
                    }
                    res.send('Registration sent');
                    res.end();
                });
            });
        }
    });

    server.get('/student/enrolment', (req, res) => {
        if (req.session.login && req.session.role === 'STUDENT') {
	    db.query('SELECT CourseClass.course_id, Enrolment.midterm_score, Enrolment.final_score, Course.progress_weight FROM Enrolment JOIN (CourseClass, Course) ON (Enrolment.class_id = CourseClass.class_id AND Enrolment.semester = CourseClass.semester AND CourseClass.course_id = Course.course_id) WHERE student_id = ?', [req.session.user_id], (db_err, db_res, fields) => {
	        res.send(db_res);
	        res.end();
	    });
        }
    });

    server.get('/student/previous-enrolment', (req, res) => {
        if (req.session.login && req.session.role === 'STUDENT') {
	    db.query('SELECT CourseClass.course_id, Enrolment.midterm_score, Enrolment.final_score, Course.progress_weight FROM Enrolment JOIN (CourseClass, Course, Semester) ON (Enrolment.class_id = CourseClass.class_id AND Enrolment.semester = CourseClass.semester AND CourseClass.course_id = Course.course_id AND Enrolment.semester != Semester.current_s) WHERE student_id = ?', [req.session.user_id], (db_err, db_res, fields) => {
	        res.send(db_res);
	        res.end();
	    });
        }
    });

    server.get('/student/curriculum', (req, res) => {
        if (req.session.login && req.session.role === 'STUDENT') {
	    db.query('SELECT Curriculum.course_id, Course.course_name, Course.credit FROM Curriculum JOIN Course ON Curriculum.course_id = Course.course_id WHERE Curriculum.class_id = ?', [req.session.class_id], (db_err, db_res, fields) => {
	        res.send(db_res);
	        res.end();
	    });
        }
    });

    server.get('/student/class/list', (req, res) => {
        let class_id = req.headers.class_id;
        if (req.session.login && req.session.role === 'STUDENT') {
            db.query('SELECT Course.course_name, Course.course_id, CourseClass.class_id, CourseClass.class_day, CourseClass.start_time, CourseClass.end_time FROM CourseClass JOIN (Course, Semester) ON (CourseClass.course_id = Course.course_id AND CourseClass.semester = Semester.current_s) WHERE CourseClass.class_id = ?', [class_id], (db_err, db_res, fields) => {
                res.send(db_res);
                res.end();
            });
        }
    });

    server.get('/student/course/list', (req, res) => {
        let class_id = req.headers.class_id;
        if (req.session.login && req.session.role === 'STUDENT') {
            db.query('SELECT * FROM Course WHERE course_id = ?', [req.headers.course_id], (db_err, db_res, fields) => {
                res.send(db_res);
                res.end();
            });
        }
    });

    server.get('/student/get/course-requirement', (req, res) => {
        if (req.session.login && req.session.role === 'STUDENT') {
            db.query('SELECT * FROM CourseRequirement', [], (db_err, db_res, fields) => {
                res.send(db_res);
                res.end();
            });
        }
    });
};
