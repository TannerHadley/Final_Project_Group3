const express = require('express');
const courseController = require('../controllers/courseController');
const cartController = require('../controllers/cartController');

const router = express.Router();

// course routes
router.get('/', courseController.course_index);
router.post('/', courseController.course_create_post);
router.get('/create', courseController.course_create_get);
router.get('/:id', courseController.course_details);
router.put('/:id', courseController.course_update);
router.delete('/:id', courseController.course_delete);

// cart routes
router.post('/cart', cartController.postCartPage);
router.get('/cart', cartController.getCartPage);

module.exports = router;
