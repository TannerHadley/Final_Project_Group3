const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3030;
const morgan = require('morgan');
const mongoose = require('mongoose');
const ejs = require('ejs'); // Make sure to require ejs
const Course = require('./models/course');
const courseRoutes = require('./routes/courseRoutes');

const app = express();

// Middleware & static files
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use(express.json());

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

// 404 page
app.use((req, res) => {
    res.status(404).render('404', { title: '404' });
});
