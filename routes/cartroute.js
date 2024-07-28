const express = require('express');
const cartController = require('../controllers/cartControl');

const router = express.Router();
router.get('/index', cartController.cart_index);
router.get('/:id', cartController.cart_index);
router.post('/:id', cartController.cart_create_post);
router.delete('/:id', cartController.cart_delete);

module.exports = router;
