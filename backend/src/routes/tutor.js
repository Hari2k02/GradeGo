/**
 * This file defines the routes for tutor functionality.
 */

var express = require('express');
var router = express.Router();
const InternalMark = require(__dirname+'/../models/InternalMark');
const FacultyCourses = require(__dirname+'/../models/FacultyCourses');
const StudentCourses = require(__dirname+'/../models/StudentCourses');
const Students = require(__dirname+'/../models/Student');

/**
 * POST /tutor/attendancedata
 * Retrieves the list of students in a given semester, batch, and course.
 * @param {Number} semester - Semester number
 * @param {Number} batch - Batch number
 * @param {String} courseCode - Course code
 * @returns {Array} - Array of student details
 */
router.post('/tutor/attendancedata', async (req, res) => {
  try {
    const { semester, batch, courseCode } = req.body;
    const students = await Students.find({ currentSemester: semester, batch: batch }, { _id: 1 });
    let studentsList = [];
    for (let i = 0; i < students.length; ++i) {
      const studentId = await StudentCourses.findOne({ _id: students[i]._id, 'coursesEnrolled.semesterCourses.courseCode': courseCode }, { _id: 1 });
      const studentNameList = await Students.findOne({ _id: studentId }, { _id: 1, name: 1 });
      if (studentNameList) {
        studentsList.push(studentNameList);
      }
    }
    return res.json(studentsList);
  }
  catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * POST /tutor/data
 * Retrieves the course and semester details for a faculty.
 * @param {String} _id - Faculty ID
 * @returns {Object} - Faculty course and semester details
 */
router.post('/tutor/data', async (req, res) => {
  try {
    const { _id } = req.body;
    const facultyDetails = await FacultyCourses.findOne({ _id: _id });
    return res.json({ facultyDetails });
  }
  catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * POST /tutor/attendance
 * Updates the attendance records for students in a course.
 * @param {Array} data - Array of attendance data objects
 * @returns {Object} - Success status
 */
router.post('/tutor/attendance', async (req, res) => {
  try {
    const data = req.body;
    for (let i = 0; i < data.length; ++i) {
      const { _id, courseCode, date, hour, isPresent } = data[i];
      const exists = await InternalMark.findOne({_id:_id,'courseAssessmentTheory': {$elemMatch:{courseCode:courseCode,'attendance':{$elemMatch:{date:date,hour:hour}}}}});
      if(!exists) {
        const addAttendance = await InternalMark.updateOne({ _id: _id, 'courseAssessmentTheory': {$elemMatch:{courseCode:courseCode} }}, { $addToSet: {'courseAssessmentTheory.$[courseElem].attendance':{$each:[{ date: date, hour: hour, isPresent: isPresent }]}}},{arrayFilters:[{ 'courseElem.courseCode': courseCode }],new: true});
      }
      else{
        const updateAttendance = await InternalMark.findOneAndUpdate({_id:_id,'courseAssessmentTheory': {$elemMatch:{courseCode:courseCode,'attendance':{$elemMatch:{date:date,hour:hour}}}}},{$set:{'courseAssessmentTheory.$[courseElem].attendance.$[attendanceElem].isPresent': isPresent}},{arrayFilters:[{ 'courseElem.courseCode': courseCode },{ 'attendanceElem.date': date, 'attendanceElem.hour': hour }],new:true});
      }
    }
    return res.json({status:'ok'});
  }
  catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;

/*----------------------------------------------------------------
 
 This file contains the routes for tutor functionality. It handles various operations related to tutors, such as retrieving student attendance data, faculty course and semester details, and updating student attendance records.
 
 API Endpoints:
 
 1. POST /tutor/attendancedata
    Retrieves the list of students in a given semester, batch, and course.
    Request body:
    {
      "semester": 2,
      "batch": 2021,
      "courseCode": "CST101"
    }
    Response:
    [
      {
        "_id": "student1",
        "name": "John Doe"
      },
      {
        "_id": "student2",
        "name": "Jane Smith"
      },
      ...
    ]
    
 2. POST /tutor/data
    Retrieves the course and semester details for a faculty.
    Request body:
    {
      "_id": "faculty1"
    }
    Response:
    {
      "facultyDetails": {
        "_id": "faculty1",
        "course": "CST101",
        "semester": 2
      }
    }
    
 3. POST /tutor/attendance
    Updates the attendance records for students in a course.
    Request body:
    [
      {
        "_id": "student1",
        "courseCode": "CST101",
        "date": "2023-06-01",
        "hour": 1,
        "isPresent": true
      },
      {
        "_id": "student2",
        "courseCode": "CST101",
        "date": "2023-06-01",
        "hour": 1,
        "isPresent": false
      },
      ...
    ]
    Response:
    {
      "status": "ok"
    }
 
-----------------------------------------------------------------*/
