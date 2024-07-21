const express = require('express');
const courseController = require('../controllers/courseController');

const router = express.Router();

// course routes
router.get('/courses', courseController.course_index);
router.post('/course_create', courseController.course_create_post);
router.get('/course_create', courseController.course_create_get);
router.get('/courses/:id', courseController.course_details);
router.put('/courses/:id', courseController.course_update);
router.delete('courses/:id', courseController.course_delete);

module.exports = router;
