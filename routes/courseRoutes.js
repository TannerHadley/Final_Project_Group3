const express = require('express');
const Course = require('../models/course');
const path = require('path');
const ejs = require('ejs');
const { ensureAuthenticated, ensureRole } = require('../middleware/auth');

const router = express.Router();

router.get('/courses', ensureAuthenticated, (req, res) => {
    Course.find().sort({ createdAt: -1 })
        .then((result) => {
            ejs.renderFile(path.join(__dirname, '../views', 'course_index.ejs'), { courses: result, user: req.user }, (err, str) => {
                if (err) throw err;
                ejs.renderFile(path.join(__dirname, '../views', 'layout.ejs'), {
                    title: 'All Courses',
                    body: str,
                    user: req.user,
                    courses: result
                }, (err, layoutStr) => {
                    if (err) throw err;
                    res.send(layoutStr);
                });
            });
        })
        .catch((err) => {
            console.log(err);
        });
});

router.post('/courses', ensureAuthenticated, ensureRole('teacher'), (req, res) => {
    const course = new Course(req.body);

    course.save()
        .then((result) => {
            res.redirect('/courses');
        })
        .catch((err) => {
            console.log(err);
        });
});

router.get('/courses/:id', ensureAuthenticated, (req, res) => {
    const id = req.params.id;

    Course.findById(id)
        .then(result => {
            ejs.renderFile(path.join(__dirname, '../views', 'course_details.ejs'), { course: result, user: req.user }, (err, str) => {
                if (err) throw err;
                ejs.renderFile(path.join(__dirname, '../views', 'layout.ejs'), {
                    title: 'Course Details',
                    body: str,
                    user: req.user,
                    course: result
                }, (err, layoutStr) => {
                    if (err) throw err;
                    res.send(layoutStr);
                });
            });
        })
        .catch(err => {
            console.log(err);
        });
});

router.delete('/courses/:id', ensureAuthenticated, ensureRole('teacher'), (req, res) => {
    const id = req.params.id;

    Course.findByIdAndDelete(id)
        .then(result => {
            res.json({ redirect: '/courses' });
        })
        .catch(err => {
            console.log(err);
        });
});

router.get('/course_create', ensureAuthenticated, ensureRole('teacher'), (req, res) => {
    ejs.renderFile(path.join(__dirname, '../views', 'course_create.ejs'), { user: req.user }, (err, str) => {
        if (err) throw err;
        ejs.renderFile(path.join(__dirname, '../views', 'layout.ejs'), {
            title: 'Add a new course',
            body: str,
            user: req.user
        }, (err, layoutStr) => {
            if (err) throw err;
            res.send(layoutStr);
        });
    });
});

router.put('/courses/:id', ensureAuthenticated, ensureRole('teacher'), (req, res) => {
    const id = req.params.id;

    Course.findByIdAndUpdate(id, req.body, { new: true })
        .then(result => {
            res.json({ redirect: `/courses/${id}` });
        })
        .catch(err => {
            console.log(err);
        });
});

module.exports = router;
