/*
Model Name:  StudentCourses
Usage: The courses taken by a student in a particular semester is mapped in this model. here courses enrolled is set as an array so that values can be pushed into it.
Author: Harikrishnan V
*/
const mongoose = require('mongoose');

const studentCourseSchema = new mongoose.Schema({
  // here _id represents the student ktu id
  _id: {
    type: String,
    required: true,
  },
  coursesEnrolled:[
    {
      semester:{
        type: Number,
        required:true,
      },
      semesterCourses:[{
        courseCode:{
          type:String, 
          required:false
        }
      }]
    }
  ]
});

module.exports = new mongoose.model('studentCourse', studentCourseSchema);
/*
db.studentcourses.insertOne({_id:'tve20cs000', coursesEnrolled:{semester:6, semesterCourses:[{courseCode:'CST301'}, {courseCode:'CST302'}, {courseCode:'CST303'}, {courseCode:'CST304'} , {courseCode:'CST306'}, {courseCode:'CST308'}, {courseCode:'CST322'},{courseCode:'CST362'},{courseCode:'HUT300'}]}})


db.studentcourses.update(
  { _id: "tve20cs002 },
  {
    $push: {
      "coursesEnrolled.semesterCourses": {
        courseCode: "CST362"
      }
    }
  }
)

*/