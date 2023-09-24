/**
 * This file defines the routes for student functionality.
 */

var express = require('express');
const InternalMarks = require(__dirname+'/../models/InternalMark');
var router = express.Router();
const StudentCourses = require(__dirname+'/../models/StudentCourses');
const Students = require(__dirname+'/../models/Student');
const StaffAdvisor = require(__dirname+'/../models/StaffAdvisor');

/**
 * POST /attendance/student/
 * Retrieves the attendance statistics for a student in a particular course.
 * @param {String} _id - Student ID
 * @param {String} courseCode - Course code
 * @returns {Object} - Attendance statistics object
 */
router.post('/attendance/student/', async (req, res) => {
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
      output.push({
        'presentDays': results[i].presentDays,
        'totalDays': results[i].totalDays
      });
    }
    if (output.length === 0) {
      return res.status(500).json({ error: 'Internal server error' });
    }

    //logic for sending all attendace for given courseCode
    if (!_id || !courseCode) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }

    const studentAttendance = await InternalMarks.findOne(
      { _id },
      {
        'courseAssessmentTheory': {
          $elemMatch: { 'courseCode': courseCode }
        }
      }
    );

    if (!studentAttendance) {
      return res.status(404).json({ error: 'Attendance data not found' });
    }

    const courseAttendance = studentAttendance.courseAssessmentTheory[0].attendance;

    return res.json({output,courseAttendance});
  }
  catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * POST /student/studentcourses
 * Retrieves the courses enrolled by a student for the current semester.
 * @param {String} _id - Student ID
 * @returns {Array} - Array of enrolled courses
 */
router.post('/student/studentcourses', async (req, res) => {
  try {
    const { _id } = req.body;
    const student = await Students.findOne({ _id: _id });

    if (student) {
      const courses = await StudentCourses.findOne({ _id: _id, 'coursesEnrolled.semester': student.currentSemester }, { 'coursesEnrolled.semesterCourses': 1 });
      return res.json(courses.coursesEnrolled);
    } else {
      return res.status(404).json({ error: 'Student or semester not found' });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});



router.post('/getCourse/attendance', async (req, res) => {
  try {

    const { _id, courseCode } = req.body;


    if (!_id || !courseCode) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }

    const studentAttendance = await InternalMarks.findOne(
      { _id },
      {
        'courseAssessmentTheory': {
          $elemMatch: { 'courseCode': courseCode }
        }
      }
    );

    if (!studentAttendance) {
      return res.status(404).json({ error: 'Attendance data not found' });
    }

    const courseAttendance = studentAttendance.courseAssessmentTheory[0].attendance;

    res.json({ courseAttendance });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;

