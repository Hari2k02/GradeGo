var express = require('express');
var router = express.Router();
const TimeTable = require(__dirname+'/../models/TimeTable');
// const CodeToName = require('../models/CodeToName');
const Courses = require(__dirname+'/../models/Courses');
const StaffAdvisor = require(__dirname+'/../models/StaffAdvisor');

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

router.post('/facdashboard/semesterCourses', async(req, res) => {
  const {_id} = req.body;
  const findStaffAdvisor = await StaffAdvisor.findOne({_id:_id});
  const semesterCourses = await Courses.find({ semester: findStaffAdvisor.semesterHandled }, { _id: 1, courseName: 1 });
  console.log(semesterCourses);
  return res.json(semesterCourses);
});

module.exports = router;
