var express = require('express');
var router = express.Router();
const InternalMark = require(__dirname+'/../models/InternalMark');
const FacultyCourses = require(__dirname+'/../models/FacultyCourses');
const StudentCourses = require(__dirname+'/../models/StudentCourses');
const Students = require(__dirname+'/../models/Student');

// return all students of the given semester, course and 
router.post('/tutor/attendancedata', async (req, res) => {
  try {
    const { semester, batch, courseCode } = req.body;
    // const semester = 6;
    // const batch = 1;
    // const courseCode = 'CST302';
    //returns the list of student id's in the given semester and batch
    const students = await Students.find({ currentSemester: semester, batch: batch }, { _id: 1 });
    console.log(students);
    let studentsList = [];
    for (let i = 0; i < students.length; ++i) {
      const studentId = await StudentCourses.findOne({ _id: students[i]._id, 'coursesEnrolled.semesterCourses.courseCode': courseCode }, { _id: 1 });
      const studentNameList = await Students.findOne({ _id: studentId }, { _id: 1, name: 1 });
      if (studentNameList) {
        studentsList.push(studentNameList);
      }
      // if (studentId) {
      //   studentsList.push(studentId);
      // }
    }
    console.log(studentsList);
    return res.json(studentsList);
  }
  catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// returns the faculty course and semester details
router.post('/tutor/data', async (req, res) => {
  try {
    const { _id } = req.body;
    // const _id = 'ktu-f375';
    const facultyDetails = await FacultyCourses.findOne({ _id: _id });
    console.log({ facultyDetails });
    return res.json({ facultyDetails });
  }
  catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/tutor/attendance', async (req, res) => {
  // const _id = 'tve20cs000';
  // const courseCode = 'CST302';
  // const date = '2023-05-17';
  // const hour = 3;
  // const isPresent = true;
  try {
    const data = req.body;
    console.log(data);
    // data is an array of objects
    for (let i = 0; i < data.length; ++i) {
      const { _id, courseCode, date, hour, isPresent } = data[i];
      console.log(data[i]);
      const checkDuplicate = await InternalMark.findOne({_id:_id,'courseAssessmentTheory.courseCode': courseCode,'courseAssessmentTheory.attendance.date':date,'courseAssessmentTheory.attendance.hour':hour});
      if(!checkDuplicate) {
        console.log('no duplicate');
        const addAttendance = await InternalMark.updateOne({ _id: _id, 'courseAssessmentTheory.courseCode': courseCode }, { $push: { 'courseAssessmentTheory.$[].attendance': { date: date, hour: hour, isPresent: isPresent } } });
        console.log(addAttendance);
        if(addAttendance) {
          res.json({status:'ok'});
        }
        else{
          res.json({status:'error'});
        }
      }
      else{
        console.log('there is a duplicate');
        const updateAttendance = await InternalMark.updateOne({_id:_id,'courseAssessmentTheory.courseCode': courseCode},{$set:{'courseAssessmentTheory.$[].attendance': { date: date, hour: hour, isPresent: isPresent }}});
        if(updateAttendance) {
          res.json({status:'ok'});
        }
        else{
          res.json({status:'error'});
        }
      }
      
      
    }
  }
  catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;

/*----------------------------------------------------------------

 {_id: 'tve20cs000', "courseAssessmentTheory.courseCode": 'CST302'}, { $push: { courseAssessmentTheory: { attendance: { date: '2023-05-17', hour: 2, ispresent: true } } } 

*/