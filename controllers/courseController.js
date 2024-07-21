const Course = require('../models/course');

//course routes

//index of all courses
const course_index = (req, res) => {
    Course.find().sort({ createdAt: -1 })
        .then((result) => {
            res.render('courses/course_index', { title: 'All Courses', courses: result });
        })
        .catch((err) => {
            console.log(err);
        });
};

//details of one course
const course_details = (req, res) => {
    const id = req.params.id;
    
    Course.findById(id)
        .then(result => {
            res.render('course_details.ejs', { course: result, title: 'Course Details' });
        })
        .catch(err => {
            console.log(err);
        });
};

//get the page with form to create a new course
const course_create_get = (req, res) => {
    res.render('course_create.ejs', { title: 'Create a new course'});
};

//posting the new course to database
const course_create_post = (req, res) => {
    const course = new Course(req.body);

    course.save()
        .then((result) => {
            res.redirect('/courses');
        })
        .catch((err) => {
            console.log(err);
        });
};

//updating a course
const course_update = (req, res) => {
    if (!req.body) {
      return res.status(400).send({ message: "Data to update cannot be empty" });
    }
  
    const id = req.params.id;
    Course.findByIdAndUpdate(id, req.body)
      .then(data => {
        if (!data) {
          res.status(404).send({ message: `Cannot update course with id ${id}.` });
        } else {
          res.send(data);
        }
      })
      .catch(err => {
        res.status(500).send({ message: "Error updating course information" });
      });
  };

//delete a course
const course_delete = (req, res) => {
    const id = req.params.id;

    Course.findByIdAndDelete(id)
        .then(result => {
            res.json({ redirect: '/courses' });         
        })
        .catch(err => {
            console.log(err);
        });
};

module.exports = {
    course_index,
    course_details,
    course_create_get,
    course_create_post,
    course_update,
    course_delete
};
