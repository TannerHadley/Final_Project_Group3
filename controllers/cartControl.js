const Cart = require('../models/cart');

const cart_index =  (req, res) => {
    Cart.find().sort({ createdAt: -1 })
      .then(result => {
        res.render('carts/index', { course_title: 'Register', carts: result });
      })
      .catch(err => {
        console.log(err);
      });
  };

  const cart_create_post =  (req, res) => {
    const course_title = req.body.course_title;


    const cart = new Cart({ course_title });
      cart.save()
      .then(result => {
        res.redirect('/carts/index');
      })
      .catch(err => {
        console.log(err);
      });
    
  };

  const cart_delete = async (req, res) => {
    const id = req.params.id;
    Cart.findByIdAndDelete(id)
      .then(result => {
        res.json({ redirect: '/carts/index' });
      })
      .catch(err => {
        console.log(err);
      });
  };

module.exports = {
    cart_index,
    cart_create_post,
    cart_delete
}