/*
  DOCUMENTATION:

  This file contains the admin routes for the application.

  Route: POST /admin/semesterCourses
  Description: Retrieves semester courses and faculty details for a given semester.
  Request Body:
    - semester: The semester for which to retrieve the courses.

  Route: POST /admin/facultyCourseAssignment
  Description: Assigns courses to faculty members.
  Request Body:
    - An array of course assignment objects containing the following properties:
      - _id: The faculty member's ID.
      - semester: The semester for which the course is assigned.
      - batch: The batch for which the course is assigned.
      - courseCode: The code of the course to be assigned.
*/

var express = require('express');
var router = express.Router();
const Courses = require(__dirname+'/../models/Courses');
const Faculty = require(__dirname+'/../models/Faculty');
const FacultyCourses = require(__dirname+'/../models/FacultyCourses');

// Retrieves semester courses and faculty details for a given semester
router.post('/admin/semesterCourses', async (req, res) => {
  try {
    const { semester } = req.body;

    // Find courses for the given semester
    const semesterCourses = await Courses.find({ semester: semester }, { _id: 1, courseName: 1 });

    // Retrieve faculty details
    const faculties = await Faculty.find();

    return res.json({ semesterCourses, faculties });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Assigns courses to faculty members
router.post('/admin/facultyCourseAssignment', async (req, res) => {
  try {
    const input = req.body;

    for (let i = 0; i < input.length; ++i) {
      const { _id, semester, batch, courseCode } = input[i];

      // Check if the faculty course assignment already exists in the database
      const existingAssignment = await FacultyCourses.findOne({
        _id: _id,
        'coursesHandled.semester': semester,
        'coursesHandled.batch': batch,
        'coursesHandled.courseCode': courseCode,
      });

      if (existingAssignment) {
        // Skip the current iteration and move to the next iteration
        console.log('Duplicate data found. Skipping:', input[i]);
        continue;
      }

      // Add the faculty course assignment to the database if it doesn't already exist
      const addFacultyCourse = await FacultyCourses.updateOne(
        { _id: _id },
        {
          $push: { coursesHandled: { semester: semester, batch: batch, courseCode: courseCode } },
        }
      );
      console.log(addFacultyCourse);
    }

    return res.json({ status: 'ok' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
