const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3030;
const morgan = require('morgan');
const mongoose = require('mongoose');
const ejs = require('ejs'); // Make sure to require ejs
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
    res.redirect('index_FinalProjectGroup3.html');
});

app.get('/courses', (req, res) => {
    Course.find().sort({ createdAt: -1 })
        .then((result) => {
            ejs.renderFile(path.join(__dirname, 'views', 'course_index.ejs'), { courses: result }, (err, str) => {
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
            ejs.renderFile(path.join(__dirname, 'views', 'course_details.ejs'), { course: result }, (err, str) => {
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
    ejs.renderFile(path.join(__dirname, 'views', 'course_create.ejs'), {}, (err, str) => {
        if (err) throw err;
        res.render('layout', {
            title: 'Add a new course',
            body: str
        });
    });
});

// 404 page
app.use((req, res) => {
    res.status(404).render('404', { title: '404' });
});
