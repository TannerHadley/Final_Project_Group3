const express = require('express');
const Course = require('../models/course');
const path = require('path');
const ejs = require('ejs');

const router = express.Router();

router.get('/courses', (req, res) => {
    Course.find().sort({ createdAt: -1 })
        .then((result) => {
            ejs.renderFile(path.join(__dirname, '../views', 'course_index.ejs'), { courses: result }, (err, str) => {
                if (err) throw err;
                res.render('layout', {
                    title: 'All Courses',
                    body: str
                });
            });
        })
        .catch((err) => {
            console.log(err);
        });
});

router.post('/courses', (req, res) => {
    const course = new Course(req.body);

    course.save()
        .then((result) => {
            res.redirect('/courses');
        })
        .catch((err) => {
            console.log(err);
        });
});

router.get('/courses/:id', (req, res) => {
    const id = req.params.id;

    Course.findById(id)
        .then(result => {
            ejs.renderFile(path.join(__dirname, '../views', 'course_details.ejs'), { course: result }, (err, str) => {
                if (err) throw err;
                res.render('layout', {
                    title: 'Course Details',
                    body: str
                });
            });
        })
        .catch(err => {
            console.log(err);
        });
});

router.delete('/courses/:id', (req, res) => {
    const id = req.params.id;

    Course.findByIdAndDelete(id)
        .then(result => {
            res.json({ redirect: '/courses' });
        })
        .catch(err => {
            console.log(err);
        });
});

router.get('/course_create', (req, res) => {
    ejs.renderFile(path.join(__dirname, '../views', 'course_create.ejs'), {}, (err, str) => {
        if (err) throw err;
        res.render('layout', {
            title: 'Add a new course',
            body: str
        });
    });
});

router.put('/courses/:id', (req, res) => {
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