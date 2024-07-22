const express = require('express');
const router = express.Router();
const passport = require('passport');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const { ensureAuthenticated, ensureRole } = require('../middleware/auth');

router.get('/register', (req, res) => {
    res.render('register', { title: 'Register' });
});

router.post('/register', async (req, res) => {
    const { username, password, role } = req.body;
    console.log(`Attempting to register user: ${username}, role: ${role}`);

    try {
        const existingUser = await User.findOne({ username }).exec();
        if (existingUser) {
            console.error('Username already exists:', username);
            return res.status(400).send('Username already exists');
        }
        console.log('Username is available:', username);

        const hashedPassword = await bcrypt.hash(password, 10);
        console.log('Password hashed successfully');

        const newUser = new User({
            username,
            password: hashedPassword,
            role
        });

        await newUser.save();
        console.log('New user registered:', username);
        res.redirect('/login');
    } catch (err) {
        console.error('Error during registration:', err);
        res.status(500).send('Server error');
    }
});

router.get('/login', (req, res) => {
    res.render('login', { title: 'Login' });
});

router.post('/login', (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) {
            console.error('Authentication error:', err);
            return next(err);
        }
        if (!user) {
            return res.redirect('/login');
        }
        req.logIn(user, (err) => {
            if (err) {
                console.error('Login error:', err);
                return next(err);
            }
            return res.redirect('/');
        });
    })(req, res, next);
});

router.get('/logout', (req, res, next) => {
    req.logout((err) => {
        if (err) {
            console.error('Error during logout:', err);
            return next(err);
        }
        req.session.destroy((err) => {
            if (err) {
                console.error('Error destroying session during logout:', err);
                return next(err);
            }
            res.redirect('/');
        });
    });
});

router.get('/users', (req, res) => {
    User.find().sort({ createdAt: -1 })
        .then((users) => {
            ejs.renderFile(path.join(__dirname, '../views', 'user_list.ejs'), { users: users }, (err, str) => {
                if (err) throw err;
                res.render('layout', {
                    title: 'All Users',
                    body: str
                });
            });
        })
        .catch((err) => {
            console.error('Error fetching users:', err);
            res.status(500).send('Server error');
        });
});

module.exports = router;
