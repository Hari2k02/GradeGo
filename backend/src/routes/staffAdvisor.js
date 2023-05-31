var express = require('express');
var router = express.Router();
const TimeTable = require(__dirname + '/../models/TimeTable');
// const CodeToName = require('../models/CodeToName');
const Courses = require(__dirname + '/../models/Courses');
const StaffAdvisor = require(__dirname + '/../models/StaffAdvisor');
const Students = require(__dirname + '/../models/Student');
const StudentCourses = require(__dirname + '/../models/StudentCourses');
const InternalMarks = require(__dirname + '/../models/InternalMark');

// returns the time table on request from the staffadvisor dashboard for display
router.post('/facdashboard/DisplayTimeTable', async (req, res) => {
  const { semester, batch } = req.body;
  // const semester = 6;
  // const batch = 1;
  const display = await TimeTable.findOne({ _id: { semester: semester, batch: batch } });
  // console.log(display);
  return res.json(display);
});

// send the courses against a particular semester to the staffadvisor dashboard
router.get('/facdashboard/data', async (req, res) => {
  try {
    const { semester } = req.body;
    // const semester = 6;
    const courses = await Courses.find({ semester: semester });
    // console.log(courses);
    return res.json(courses);
  }
  catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// to add a new time table or update existing
router.post('/facdashboard/TimeTable', async (req, res) => {
  try {
    const { semester, batch, days } = req.body;
    // console.log(semester, batch, days);
    // check if the day is already present if present the update else add new
    const present = await TimeTable.findOne({ _id: { semester: semester, batch: batch } });
    console.log(present);
    if (present) {
      const filter = { _id: { semester, batch } };
      const update = {
        days: days.map(({ day, periods }) => ({
          _id: day.toLowerCase(), // Assuming day should be used as _id
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
      const timetable = new TimeTable({
        _id: { semester, batch },
        days: days.map(({ day, periods }) => ({
          _id: day.toLowerCase(), // Assuming day should be used as _id
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

router.post('/facdashboard/semesterCourses', async (req, res) => {
  try {
    const { _id } = req.body;
    const findStaffAdvisor = await StaffAdvisor.findOne({ _id: _id });
    const semesterCourses = await Courses.find({ semester: findStaffAdvisor.semesterHandled }, { _id: 1, courseName: 1 });
    console.log(semesterCourses);
    return res.json(semesterCourses);
  }
  catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/facdashboard/studentAttendance', async (req, res) => {
  try {
    const { _id, courseCode } = req.body;
    // find the semester and batch from the _id
    const semesterAndBatch = await StaffAdvisor.findOne({ _id: _id }, { semesterHandled: 1, batchHandled: 1 });
    // now find the students with this semester and batch
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

    let ktuIds = studentsList.map(student => student._id); // Simplified array mapping

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

router.post('/facdashboard/batchAttendanceReport', async (req, res) => {
  const {_id} = req.body;

  const semesterAndBatch = await StaffAdvisor.findOne({ _id: _id }, { semesterHandled: 1, batchHandled: 1 });
  const semester = semesterAndBatch.semesterHandled;
  const batch = semesterAndBatch.batchHandled;
  const students = await Students.find({ currentSemester: semester, batch: batch }, { _id: 1 });

  const courses = await Courses.find({semester:semester}, {_id:1});

  let finalOutput = [];
  for(let i = 0; i < courses.length; i++) {
    const courseCode = courses[i]._id;
    let studentsList = [];
    for (let i = 0; i < students.length; ++i) {
      const studentId = await StudentCourses.findOne({ _id: students[i]._id, 'coursesEnrolled.semesterCourses.courseCode': courseCode }, { _id: 1 });
      const studentNameList = await Students.findOne({ _id: studentId }, { _id: 1, name: 1 });
      if (studentNameList) {
        studentsList.push(studentNameList);
      }
    }

    let ktuIds = studentsList.map(student => student._id); // Simplified array mapping

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
      const studentName = await Students.findOne({ _id: results[i]._id }, { name: 1 });
      output.push({
        '_id': results[i]._id,
        'name': studentName.name,
        'courseCode':courseCode,
        'presentDays': results[i].presentDays,
        'totalDays': results[i].totalDays
      });
    }
    // return res.json(output);
    if (output.length !== 0) {
      finalOutput.push(output);
    }
  }
  return res.json(finalOutput);
});

module.exports = router;
