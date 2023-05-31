var express = require('express');
const InternalMarks = require(__dirname+'/../models/InternalMark');
var router = express.Router();
const StudentCourses = require(__dirname+'/../models/StudentCourses');
const Students = require(__dirname+'/../models/Student');
const StaffAdvisor = require(__dirname+'/../models/StaffAdvisor');

router.post('/attendance/student/', async (req, res) => {
  // const ktuId = 'tve20cs000';
  // const courseCode = 'CST302';
  try {
    const { _id, courseCode } = req.body;
    // find the semester an batch from the _id
    const semesterAndBatch = await StaffAdvisor.findOne({ _id: _id }, { semesterHandled: 1, batchHandled: 1 });
    // now find the students with this semester and batch
    const semester = semesterAndBatch.semesterHandled;
    const batch = semesterAndBatch.batchHandled;
    const students = await Students.find({ currentSemester: semester, batch: batch }, { _id: 1 });
    // console.log(students);
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


    let ktuIds = [];
    for (let i = 0; i < studentsList.length; i++) {
      ktuIds.push(studentsList[i]._id);
    }

    const results = await InternalMarks.aggregate([
      { $unwind: '$courseAssessmentTheory' },
      { $match: { _id: { $in: ktuIds }, 'courseAssessmentTheory.courseCode': courseCode } },
      { $unwind: '$courseAssessmentTheory.attendance' },
      {
        $match: {
          'courseAssessmentTheory.attendance.isPresent': true
        }
      },
      {
        $group: {
          _id: '$_id',
          presentDays: { $addToSet: '$courseAssessmentTheory.attendance.date' },
          totalDays: { $sum: 1 }
        }
      }
    ]).exec();
    let output = [];
    console.log(results);
    // Log the attendance statistics
    for (let i = 0; i < results.length; ++i) {
      const studentName = await Students.findOne({ _id: results[i]._id }, { name: 1 });
      output.push({ '_id': results[i]._id, 'name': studentName, 'presentDays': results[i].presentDays.length, 'totalDays': results[i].totalDays });
    }
    return res.json(output);
  }
  catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }

});

router.post('/student/studentcourses', async (req, res) => {
  // const _id = 'tve20cs001';
  
  try {
    const { _id } = req.body;
    const student = await Students.findOne({ _id: _id });
    // console.log(student);
    if (student) {
      // console.log(student.currentSemester);
      const courses = await StudentCourses.findOne({ _id: _id, 'coursesEnrolled.semester': student.currentSemester }, { 'coursesEnrolled.semesterCourses': 1 });
      console.log(courses);
      return res.json(courses.coursesEnrolled);
    } else {
      // Handle case when student or semester is missing
      return res.status(404).json({ error: 'Student or semester not found' });
    }
  } catch (error) {
    // Handle any potential errors during database operations
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }

});

module.exports = router;