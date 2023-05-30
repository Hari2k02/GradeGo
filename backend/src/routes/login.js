var express = require('express');
require('dotenv').config();
var router = express.Router();
const Login = require(__dirname + '/../models/Login');
const Student = require(__dirname + '/../models/Student');
const Faculty = require(__dirname + '/../models/Faculty');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const StaffAdvisor = require(__dirname + '/../models/StaffAdvisor');
const StudentCourses = require(__dirname + '/../models/StudentCourses');
// const CodeToName = require('../models/CodeToName');
const { authenticateToken, generateAccessToken } = require(__dirname + '/../middlewares/auth');
const Courses = require(__dirname + '/../models/Courses');

let refreshTokens = [];

router.post('/login', async (req, res) => {
  console.log(req.body);
  // check in db if he is a valid user if he is then redirect to dashboard
  try {
    const { ktuId, password } = req.body;
    console.log(ktuId, password);
    //jwt implementation
    const user = { name: ktuId };
    //const accessToken = jwt.sign(user,process.env.ACCESS_TOKEN_SECRET,{expiresIn:'20s'});
    const accessToken = generateAccessToken(user);
    const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET);
    refreshTokens.push(refreshToken);

    const pass = await Login.findOne({ _id: ktuId }, { password: 1 });
    console.log(pass);
    if (pass) {
      const passwordMatches = bcrypt.compareSync(password, pass.password);
      console.log(passwordMatches);

      if (passwordMatches) {
        console.log('valid user');
        //check whether the person is a teacher or a student
        // check whether the person is in the student table
        const isStudent = await Student.findOne({ _id: ktuId });
        // console.log(isStudent);
        if (ktuId === 'admin') {
          return res.json({ status: 'ok', user: 'admin', accessToken: accessToken, refreshToken: refreshToken });
        }
        if (isStudent) {
          const studentCourses = await StudentCourses.findOne({ _id: ktuId });
          const batchDetails = await Student.findOne({ _id: ktuId }, { batch: 1 });
          const nameDetails = await Student.findOne({ _id: ktuId }, { name: 1, email: 1 });
          return res.json({ status: 'ok', user: 'student', name: nameDetails, details: { studentCourses, batchDetails }, accessToken: accessToken, refreshToken: refreshToken });
        } else {
          const isFaculty = await Faculty.findOne({ _id: ktuId });

          const isStaffAdvisor = await Faculty.findOne(
            { _id: ktuId, 'roles.roleName': 'Staff Advisor' }, { _id: 1 });
          const nameDetail = await Faculty.findOne({ _id: ktuId }, { name: 1, email: 1 });
          if (isFaculty) {
            if (isStaffAdvisor) {
              console.log('hello world guys');
              const staffDetails = await StaffAdvisor.findOne({ _id: ktuId });
              //console.log(staffDetails);
              // const courseDetails = await CodeToName.findOne({_id:staffDetails.semesterHandled});
              const courseDetails = await Courses.find({ semester: staffDetails.semesterHandled });
              //console.log(courseDetails);
              return res.json({ status: 'ok', user: 'faculty', name: nameDetail, details: staffDetails, course: courseDetails, accessToken: accessToken, refreshToken: refreshToken });
            }
            else {
              return res.json({ status: 'ok', user: 'faculty', name: nameDetail, accessToken: accessToken, refreshToken: refreshToken });
            }
          }
          else {
            console.log('error');
          }
        }
      } else {
        console.log('invalid password');
        return res.json({ status: 'error', user: 'invalid' });
      }
    } else {
      console.log('invalid username');
      return res.json({ status: 'error', user: 'invalid' });
    }
  }
  catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/facdashboard', authenticateToken, async (req, res) => {
  try {
    const logins = await Login.find();
    console.log(logins);
    res.json(logins.filter(login => login._id === req.user.name));
  }
  catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/tokens', (req, res) => {
  try {
    const refreshToken = req.body.token;
    if (refreshToken === null) {
      return res.sendStatus(401);
    }
    if (!refreshTokens.includes(refreshToken)) {
      return res.sendStatus(403);
    }
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
      if (err) {
        return res.sendStatus(403);
      }
      const accessToken = generateAccessToken({ name: user.name });
      return res.json({ status: 'ok', accessToken: accessToken });
    });
  }
  catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});


router.delete('/logout', (req, res) => {
  try {
    refreshTokens = refreshTokens.filter(token => token !== req.body.token);
    res.sendStatus(204);
  }
  catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});


module.exports = router;
