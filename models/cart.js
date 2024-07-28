const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const cartSchema = new Schema({
    course_title: {
      type: String,
    },
     course_number: {
        type: String,
      
    },
    course_description: {
        type: String,
      
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
}, { timestamps: true });

const Cart = mongoose.model('Cart', cartSchema);
module.exports = Cart;
