const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3030;
const morgan = require('morgan');
const mongoose = require('mongoose');
const ejs = require('ejs'); // Make sure to require ejs
const Course = require('./models/course');
const courseRoutes = require('./routes/courseRoutes');
const authRoutes = require('./routes/authRoutes');
const cookieParser = require('cookie-parser');
const { requireAuth, checkUser } = require('./middleware/authMiddleware');

const app = express();

// Middleware & static files
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser());

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

app.use('/courses', courseRoutes);

//routes for smoothie JWT Node Auth Tutorial
app.get('*', checkUser);
app.get('/homeJWT', (req, res) => res.render('homeJWT'));
app.get('/smoothies', requireAuth, (req, res) => res.render('smoothies'));
app.use(authRoutes);

// 404 page
app.use((req, res) => {
    res.status(404).render('404', { title: '404' });
});
