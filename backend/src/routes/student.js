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
    let ktuIds = [_id];
    const results = await InternalMarks.aggregate([
      { $unwind: '$courseAssessmentTheory' },
      { $match: { _id: { $in: ktuIds }, 'courseAssessmentTheory.courseCode': courseCode } },
      { $unwind: '$courseAssessmentTheory.attendance' },
      {
        $group: {
          _id: '$_id',
          presentDays: {
            $sum: {
              $cond: [
                { $eq: ['$courseAssessmentTheory.attendance.isPresent', true] },
                1,
                0
              ]
            }
          },
          totalDays: { $sum: 1 }
        }
      }
    ]).exec();

    let output = [];
    // Log the attendance statistics
    for (let i = 0; i < results.length; ++i) {
      // const studentName = await Students.findOne({ _id: results[i]._id }, { name: 1 });
      output.push({
        'presentDays': results[i].presentDays,
        'totalDays': results[i].totalDays
      });
    }
    if (output.length === 0) {
      return res.status(500).json({ error: 'Internal server error' });
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