const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3030;
const morgan = require('morgan');
const mongoose = require('mongoose');
const Course = require('./models/course');

// Middleware & static files
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Register view engine
app.set('view engine', 'ejs');

// Connect to MongoDB
console.log("establishing connection");
const dbURI = 'mongodb+srv://netninja:SDEV255@nodetutscluster.o0leayf.mongodb.net/nodetutscluster';

mongoose.connect(dbURI)
    .then((result) => {
        console.log("established connection");
        app.listen(PORT, () => {
            console.log(`Server started on port ${PORT}`);
        });
    })
    .catch((err) => console.log(err));

// Routes
app.get('/', (req, res) => {
    res.redirect('/courses');
});

app.get('/courses', (req, res) => {
    Course.find().sort({ createdAt: -1 })
        .then((result) => {
            res.render('course_index', { title: 'All Courses', courses: result });
        })
        .catch((err) => {
            console.log(err);
        });
});

app.post('/courses', (req, res) => {
    const course = new Course(req.body);

    course.save()
        .then((result) => {
            res.redirect('/courses');
        })
        .catch((err) => {
            console.log(err);
        });
});

app.get('/courses/:id', (req, res) => {
    const id = req.params.id;

    Course.findById(id)
        .then(result => {
            res.render('course_details', { course: result, title: 'Course Details' });
        })
        .catch(err => {
            console.log(err);
        });
});

app.delete('/courses/:id', (req, res) => {
    const id = req.params.id;

    Course.findByIdAndDelete(id)
        .then(result => {
            res.json({ redirect: '/courses' });
        })
        .catch(err => {
            console.log(err);
        });
});

app.get('/course_create', (req, res) => {
    res.render('course_create', { title: 'Add a new course' });
});

// 404 page
app.use((req, res) => {
    res.status(404).render('404', { title: '404' });
});
