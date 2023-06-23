/*
  This file contains the login routes for the application.
*/

/*
DOCUMENTATION:

This file contains the login routes for the application.

Route: POST /login
Description: Authenticates user login credentials and generates access and refresh tokens.

Route: GET /facdashboard
Description: Retrieves faculty dashboard details for the authenticated user.
Middleware: authenticateToken - verifies the access token of the user.

Route: POST /tokens
Description: Generates a new access token using a refresh token.

Route: DELETE /logout
Description: Removes a refresh token from the array of stored refresh tokens.

*/

// Required modules and dependencies
var express = require('express');
require('dotenv').config();
const nodemailer = require('nodemailer');
var router = express.Router();
const Login = require(__dirname + '/../models/Login');
const Student = require(__dirname + '/../models/Student');
const Faculty = require(__dirname + '/../models/Faculty');
const InternalMark = require(__dirname + '/../models/InternalMark');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const StaffAdvisor = require(__dirname + '/../models/StaffAdvisor');
const StudentCourses = require(__dirname + '/../models/StudentCourses');
const { authenticateToken, generateAccessToken } = require(__dirname + '/../middlewares/auth');
const {generateOTP} = require(__dirname + '/../middlewares/otp');
const Courses = require(__dirname + '/../models/Courses');

// Array to store refresh tokens
let refreshTokens = [];

/*
  Route: POST /login
  Description: Authenticates user login credentials and generates access and refresh tokens.
*/
router.post('/login', async (req, res) => {
  console.log(req.body);
  try {
    // Extract login credentials from request body
    const { ktuId, password } = req.body;

    // Generate access and refresh tokens
    const user = { name: ktuId };
    const accessToken = generateAccessToken(user);
    const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET);
    refreshTokens.push(refreshToken);

    // Find the user in the database
    const pass = await Login.findOne({ _id: ktuId }, { password: 1 });

    if (pass) {
      // Compare the provided password with the stored password
      const passwordMatches = bcrypt.compareSync(password, pass.password);

      if (passwordMatches) {
        // If the password is valid, determine user type (student or faculty)
        if (ktuId === 'admin') {
          return res.json({ status: 'ok', user: 'admin', accessToken: accessToken, refreshToken: refreshToken });
        } else {
          // Check if the user is a student
          const isStudent = await Student.findOne({ _id: ktuId });

          if (isStudent) {
            // If the user is a student, fetch student details
            const studentCourses = await StudentCourses.findOne({ _id: ktuId });
            const batchDetails = await Student.findOne({ _id: ktuId }, { batch: 1 });
            const nameDetails = await Student.findOne({ _id: ktuId }, { name: 1, email: 1 });
            //let att = [];
            //attendance percentage on login

            // Find the document with the given _id
            const course = await InternalMark.findById(ktuId);

            if (!course) {
              return res.status(404).json({ error: 'Course not found' });
            }

            // Perform the aggregation to calculate attendance percentage
            const attendancePer = await InternalMark.aggregate([
              { $match: { '_id': ktuId } },
              { $unwind: '$courseAssessmentTheory' },
              { $unwind: '$courseAssessmentTheory.attendance' },
              {
                $group: {
                  _id: '$courseAssessmentTheory.courseCode',
                  total: { $sum: 1 },
                  present: { $sum: { $cond: [{ $eq: ['$courseAssessmentTheory.attendance.isPresent', true] }, 1, 0] } }
                }
              },
              {
                $project: {
                  //courseCode: '$_id',
                  attendancePercentage: { $multiply: [{ $divide: ['$present', '$total'] }, 100] }
                }
              }
            ]);



            return res.json({ status: 'ok', user: 'student', name: nameDetails, details: { studentCourses, batchDetails }, accessToken: accessToken, refreshToken: refreshToken,attendancePer:attendancePer });
          } else {
            // If the user is not a student, check if they are a faculty member
            const isFaculty = await Faculty.findOne({ _id: ktuId });
            const isStaffAdvisor = await Faculty.findOne(
              { _id: ktuId, 'roles.roleName': 'Staff Advisor' }, { _id: 1 });
            const nameDetail = await Faculty.findOne({ _id: ktuId }, { name: 1, email: 1 });

            if (isFaculty) {
              // If the user is a faculty member, check if they are a staff advisor
              if (isStaffAdvisor) {
                const staffDetails = await StaffAdvisor.findOne({ _id: ktuId });
                const courseDetails = await Courses.find({ semester: staffDetails.semesterHandled });

                return res.json({ status: 'ok', user: 'faculty',isAdvisor:'yes', name: nameDetail, details: staffDetails, course: courseDetails, accessToken: accessToken, refreshToken: refreshToken });
              } else {
                return res.json({ status: 'ok', user: 'faculty',isAdvisor:'no', name: nameDetail, accessToken: accessToken, refreshToken: refreshToken });
              }
            } else {
              console.log('error');
            }
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
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

/*
  Route: GET /facdashboard
  Description: Retrieves faculty dashboard details for the authenticated user.
  Middleware: authenticateToken - verifies the access token of the user.
*/
router.get('/facdashboard', authenticateToken, async (req, res) => {
  try {
    // Retrieve login details for the authenticated user
    const logins = await Login.find();
    console.log(logins);

    res.json(logins.filter(login => login._id === req.user.name));
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

/*
  Route: POST /tokens
  Description: Generates a new access token using a refresh token.
*/
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
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

/*
  Route: DELETE /logout
  Description: Removes a refresh token from the array of stored refresh tokens.
*/
router.delete('/logout', (req, res) => {
  try {
    refreshTokens = refreshTokens.filter(token => token !== req.body.token);
    res.sendStatus(204);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

let otp;

//Send Recovery email on forgot password

// Define the API route
router.post('/reset-password', async (req, res) => {
  try {
    const { email } = req.body;
    otp = generateOTP();
    //const email ='harivhari2020@gmail.com';
    // Create a Nodemailer transporter using Gmail's SMTP server
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD
      },
    });

    // Send the email
    await transporter.sendMail({
      from: process.env.EMAIL_USERNAME,
      to: email,
      subject: 'OTP for forgot-password confirmation',
      text: otp,
    });

    res.status(200).json({ message: 'Email sent successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to send email' });
  }
});

router.post('/confirm-otp',(req,res)=>{
  const otpNumber = req.body;
  if(otpNumber === otp) {
    return res.json({status:'ok'});
  }
  else{
    return res.json({status:'error'});
  }
});


// Export the router
module.exports = router;
