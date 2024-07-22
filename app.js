const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3030;
const morgan = require('morgan');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const ejs = require('ejs');

require('./config/passport')(passport);

// Middleware & static files
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use(express.json());

// Session middleware
app.use(session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: true
}));

// Initialize Passport and restore authentication state, if any, from the session
app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
    res.locals.user = req.user;
    next();
});

// Register view engine
app.set('view engine', 'ejs');

// Connect to MongoDB
mongoose.connect('mongodb+srv://groupuser:1@sdev255group3.zkt4cuj.mongodb.net/?retryWrites=true&w=majority&appName=SDEV255Group3')
    .then((result) => {
        console.log('established connection');
        app.listen(PORT, () => {
            console.log(`Server started on port ${PORT}`);
        });
    })
    .catch((err) => console.error('Failed to connect to MongoDB:', err));

// Home page route
app.get('/', (req, res) => {
    ejs.renderFile(path.join(__dirname, 'views', 'index.ejs'), {}, (err, str) => {
        if (err) throw err;
        res.render('layout', {
            title: 'Home',
            body: str
        });
    });
});

// student route
app.get('/teacher_details', (req, res) => {
    ejs.renderFile(path.join(__dirname, 'views', 'teacher_details.ejs'), {}, (err, str) => {
        if (err) throw err;
        res.render('layout', {
            title: 'Teacher Details',
            body: str
        });
    });
});


// teacher route
app.get('/student_details', (req, res) => {
    ejs.renderFile(path.join(__dirname, 'views', 'student_details.ejs'), {}, (err, str) => {
        if (err) throw err;
        res.render('layout', {
            title: 'Student Details',
            body: str
        });
    });
});



// Routes
const authRoutes = require('./routes/authRoutes');
const courseRoutes = require('./routes/courseRoutes');

app.use(authRoutes);
app.use(courseRoutes);


// 404
app.get('/404', (req, res) => {
    ejs.renderFile(path.join(__dirname, 'views', '404.ejs'), {}, (err, str) => {
        if (err) throw err;
        res.render('404', {
            title: '404',
            body: str
        });
    });
});
