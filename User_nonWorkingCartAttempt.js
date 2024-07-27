const mongoose = require('mongoose');
const { isEmail } = require('validator');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Please enter an email'],
        unique: true,
        lowercase: true,
        validate: [isEmail, 'Please enter a valid email']
    },
    password: {
        type: String,
        required: [true, 'Please enter a password'],
        minlength: [6, 'Minimum password length is 6 characters']
    },
    role: { 
        type: String,
        enum: ['teacher', 'student'],
        //required: true
    },

    cart: {
        items: [{
            courseId: {
                type: mongoose.Types.ObjectId,
                ref: 'Course',
                //required: true
            },
            course_title: {
                type: String,
                //required: true           
            }
            
        }],
    }
});



//fire a function before doc saved to db
userSchema.pre('save', async function(next) {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
    next();
})

//static method to login user
userSchema.statics.login = async function(email, password) {
    const user = await this.findOne({ email });
    if (user) {
        const auth = await bcrypt.compare(password, user.password);
        if (auth) {
            return user;
        }
        throw Error('incorrect password');
    }
    throw Error('incorrect email');

}

//user Schema method to add to cart
userSchema.methods.addToCart = function(product) {
    let cart = this.cart;

    if(cart.items.length == 0) {
        cart.items.push({courseId: course._id, course_title: course_title});
        console.log('User in schema?');
    } else {

        const isExisting = cart.items.findIndex(objInItems => objInItems.courseId == course._id);
        if (isExisting == -1) {
            cart.items.push({ courseId: course._id, course_title: course_title});
        } else {
            existingCourseInCart = cart.items[isExisting];
            
        }

    }

}
    //return this.save();

    console.log('User in schema: ', this);



const User = mongoose.model('User', userSchema);

module.exports = User;