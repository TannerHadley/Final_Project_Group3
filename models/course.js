const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const courseSchema = new Schema({
    course_title: {
        type: String,
        required: true
    },
    course_subject: {
        type: String,
        required: true
    },
    course_description: {
        type: String,
        required: true
    },
    course_credits: {
        type: String,
        required: true
    }
}, { timestamps: true });

const Course = mongoose.model('Course', courseSchema);
module.exports = Course;
