var express = require('express');
var router = express.Router();
const InternalMark = require('../models/InternalMark');

router.get('/tutor/attendance', async(req, res, next) => {
  const {_id, courseCode} = req.body;
  const studentAttendance = await InternalMark.findOne({_id:_id, 'courseAssessmentTheory.courseCode':courseCode});
  return res.json(studentAttendance);
});

router.post('/tutor/attendance', async (req, res) => {
  // const _id = 'tve20cs000';
  // const courseCode = 'CST302';
  // const date = '2023-05-17';
  // const hour = 3;
  // const isPresent = true;
  const{_id, courseCode, date, hour, isPresent} = req.body;
  const addAttendance = await InternalMark.updateOne({_id:_id, 'courseAssessmentTheory.courseCode': courseCode}, { $push: {'courseAssessmentTheory.$[].attendance': { date: date, hour: hour, isPresent: isPresent }} });
  console.log(addAttendance);
});

module.exports = router;

/*----------------------------------------------------------------

 {_id: 'tve20cs000', "courseAssessmentTheory.courseCode": 'CST302'}, { $push: { courseAssessmentTheory: { attendance: { date: '2023-05-17', hour: 2, ispresent: true } } } 

*/