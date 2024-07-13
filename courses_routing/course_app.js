const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const Course = require('./models/course');

//express app
const app = express();

// connect to mongodb
const dbURI = 'mongodb+srv://netninja:SDEV255@nodetutscluster.o0leayf.mongodb.net/nodetutscluster';
//mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.connect(dbURI)
    .then((result) => app.listen(3000))
    
    .catch((err) => console.log(err));

//register view engine
app.set('view engine', 'ejs');

//middleware & static files
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true}));
app.use(morgan('dev'));

//routes

app.get('/', (req, res) => {
    res.redirect('/courses');
});

//blog routes

app.get('/courses', (req, res) => {
    Course.find().sort({ createdAt: -1 })
        .then((result) => {
            res.render('course_index', { title: 'All Courses', courses: result })
        })
        .catch((err) => {
            console.log(err);
        })
})

app.post('/courses', (req, res) => {
    const course = new Course(req.body);

    course.save()
        .then((result) => {
            res.redirect('/courses');
        })
        .catch((err) => {
            console.log(err);
        })
})

app.get('/courses/:id', (req, res) => {
    const id = req.params.id;
    
    Course.findById(id)
        .then(result => {
            res.render('course_details.ejs', { course: result, title: 'Course Details' });
        })
        .catch(err => {
            console.log(err);
        });
})

app.delete('/courses/:id', (req, res) => {
    const id = req.params.id;

    Course.findByIdAndDelete(id)
        .then(result => {
            res.json({ redirect: '/courses' });         
        })
        .catch(err => {
            console.log(err);
        })
})


app.get('/course_create', (req, res) => {
    res.render('course_create.ejs', { title: 'Add a new course'});
});

//404 page
app.use((req, res) => {
    res.status(404).render('404.ejs', { title: '404'});
})