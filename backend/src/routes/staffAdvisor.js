/**
 * staffAdvisor.js
 *
 * This file contains the routes and handlers for the staff advisor dashboard functionalities.
 * It provides APIs to retrieve and update timetable, course information, student attendance, and generate attendance reports.
 */

var express = require('express');
var router = express.Router();
const TimeTable = require(__dirname + '/../models/TimeTable');
const Courses = require(__dirname + '/../models/Courses');
const StaffAdvisor = require(__dirname + '/../models/StaffAdvisor');
const Students = require(__dirname + '/../models/Student');
const StudentCourses = require(__dirname + '/../models/StudentCourses');
const InternalMarks = require(__dirname + '/../models/InternalMark');
const Login = require(__dirname + '/../models/Login');
const generatePassword = require('generate-password');
const bcrypt = require('bcrypt');
const saltRounds = 10;
/**
 * POST /facdashboard/DisplayTimeTable
 * Returns the time table for display on the staff advisor dashboard.
 * @param {Number} semester - Semester number
 * @param {Number} batch - Batch number
 * @returns {Object} - Time table data
 */
router.post('/facdashboard/DisplayTimeTable', async (req, res) => {
  const { semester, batch } = req.body;
  const display = await TimeTable.findOne({ _id: { semester: semester, batch: batch } });
  return res.json(display);
});

/**
 * GET /facdashboard/data
 * Retrieves the courses for a particular semester to display on the staff advisor dashboard.
 * @param {Number} semester - Semester number
 * @returns {Array} - Array of course objects
 */
router.get('/facdashboard/data', async (req, res) => {
  try {
    const { semester } = req.body;
    const courses = await Courses.find({ semester: semester });
    return res.json(courses);
  }
  catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * POST /facdashboard/TimeTable
 * Adds a new time table or updates an existing one.
 * @param {Number} semester - Semester number
 * @param {Number} batch - Batch number
 * @param {Array} days - Array of day objects containing periods
 * @returns {Object} - Success status
 */
router.post('/facdashboard/TimeTable', async (req, res) => {
  try {
    const { semester, batch, days } = req.body;
    const present = await TimeTable.findOne({ _id: { semester: semester, batch: batch } });

    if (present) {
      // Update existing time table
      const filter = { _id: { semester, batch } };
      const update = {
        days: days.map(({ day, periods }) => ({
          _id: day.toLowerCase(),
          periods: periods.map(({ _id, abbreviation }) => ({
            _id,
            duration: {},
            courseAbbreviation: abbreviation
          }))
        }))
      };

      TimeTable.findOneAndUpdate(filter, update)
        .then(() => {
          console.log('TimeTable data updated successfully');
          return res.json({ status: 'ok' });
        })
        .catch(error => {
          console.error('Error updating TimeTable data:', error);
        });
    } else {
      // Insert new time table
      const timetable = new TimeTable({
        _id: { semester, batch },
        days: days.map(({ day, periods }) => ({
          _id: day.toLowerCase(),
          periods: periods.map(({ _id, abbreviation }) => ({
            _id,
            duration: {},
            courseAbbreviation: abbreviation
          }))
        }))
      });

      timetable.save()
        .then(() => {
          console.log('TimeTable data inserted successfully');
        })
        .catch(error => {
          console.error('Error inserting TimeTable data:', error);
        });
    }
  }
  catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * POST /facdashboard/semesterCourses
 * Retrieves the courses for a semester handled by a staff advisor.
 * @param {String} _id - Staff advisor ID
 * @returns {Array} - Array of course objects
 */
router.post('/facdashboard/semesterCourses', async (req, res) => {
  try {
    const { _id } = req.body;
    const findStaffAdvisor = await StaffAdvisor.findOne({ _id: _id });
    const semesterCourses = await Courses.find({ semester: findStaffAdvisor.semesterHandled }, { _id: 1, courseName: 1 });
    return res.json(semesterCourses);
  }
  catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * POST /facdashboard/studentAttendance
 * Retrieves the attendance of students in a course.
 * @param {String} _id - Staff advisor ID
 * @param {String} courseCode - Course code
 * @returns {Array} - Array of student attendance objects
 */
router.post('/facdashboard/studentAttendance', async (req, res) => {
  try {
    const { _id, courseCode } = req.body;
    const semesterAndBatch = await StaffAdvisor.findOne({ _id: _id }, { semesterHandled: 1, batchHandled: 1 });
    const semester = semesterAndBatch.semesterHandled;
    const batch = semesterAndBatch.batchHandled;
    const students = await Students.find({ currentSemester: semester, batch: batch }, { _id: 1 });

    let studentsList = [];
    for (let i = 0; i < students.length; ++i) {
      const studentId = await StudentCourses.findOne({ _id: students[i]._id, 'coursesEnrolled.semesterCourses.courseCode': courseCode }, { _id: 1 });
      const studentNameList = await Students.findOne({ _id: studentId }, { _id: 1, name: 1 });
      if (studentNameList) {
        studentsList.push(studentNameList);
      }
    }

    let ktuIds = studentsList.map(student => student._id);

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
    for (let i = 0; i < results.length; ++i) {
      const studentName = await Students.findOne({ _id: results[i]._id }, { name: 1 });
      output.push({
        '_id': results[i]._id,
        'name': studentName,
        'presentDays': results[i].presentDays,
        'totalDays': results[i].totalDays
      });
    }
    return res.json(output);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * POST /facdashboard/batchAttendanceReport
 * Retrieves the attendance report of a batch.
 * @param {String} _id - Staff advisor ID
 * @returns {Array} - Array of student attendance report objects
 */
router.post('/facdashboard/batchAttendanceReport', async (req, res) => {
  const { _id } = req.body;

  const semesterAndBatch = await StaffAdvisor.findOne({ _id: _id }, { semesterHandled: 1, batchHandled: 1 });

  const semester = semesterAndBatch.semesterHandled;
  const batch = semesterAndBatch.batchHandled;

  const students = await Students.find({ currentSemester: semester, batch: batch }, { _id: 1 });
  const courses = await Courses.find({ semester: semester }, { _id: 1 });
  let finalOutput = [];
  for (let i = 0; i < students.length; ++i) {
    let courseData = [];
    for (let j = 0; j < courses.length; ++j) {
      const courseCode = courses[j]._id;
      let ktuIds = [students[i]._id];
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

      for (let i = 0; i < results.length; ++i) {
        courseData.push({
          'courseCode': courses[j]._id,
          'presentDays': results[i].presentDays,
          'totalDays': results[i].totalDays
        });
      }
    }
    const studentName = await Students.findOne({ _id: students[i]._id }, { name: 1 });
    finalOutput.push({ '_id': students[i]._id, 'name': studentName.name, 'courses': courseData });
  }
  return res.json(finalOutput);
});

router.post('/facdashboard/studentRegistration', async (req, res) => {
  try {
    const jsonData = req.body.jsonData; // Access the jsonData property correctly
    console.log(jsonData);
    // check if the student is already present
    // console.log(isPresent);
    for (let i = 0; i < jsonData.length; i++) {
      const isPresent = await Students.findOne({ _id: jsonData[i].ktuId.toLowerCase()});
      if (isPresent) {
        // student already present
        console.log('Student already present');
      }
      else {
        // find the present valriables and then add the student
        const newStudent = await Students.create({
          _id: jsonData[i].ktuId.toLowerCase(),
          admno: jsonData[i].admno,
          name: {
            firstName: jsonData[i].name.firstName,
            lastName: jsonData[i].name.lastName
          },
          currentSemester: jsonData[i].currentSemester,
          batch: jsonData[i].batch,
          department: jsonData[i].department
        });
        const password = generatePassword.generate({
          length: 8,  // Specify the desired length of the password
          numbers: true,  // Include numbers in the password
          symbols: true,  // Include symbols in the password
          uppercase: true,  // Include uppercase letters in the password
          lowercase: true,  // Include lowercase letters in the password
        });
        console.log(password);
        const psswd = bcrypt.hashSync(password, saltRounds);
        const newLogin = await Login.create({_id:jsonData[i].ktuId.toLowerCase(), password:psswd});
        console.log('New student created:', newStudent);
      }
    }
    return res.json({ success: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;

/**
 * This file defines the routes for staff advisor functionality.
 * It includes routes for displaying time table, retrieving courses, adding/updating time table,
 * retrieving semester courses, retrieving student attendance, and retrieving batch attendance report.
 */
