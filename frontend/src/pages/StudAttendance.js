/*
  File: StudAttendance.js
  Description: This file contains the component for displaying student attendance.
*/

import React, { useState, useEffect, useContext } from 'react';
import { useTheme } from '@mui/material/styles';
import {
  Grid,
  MenuItem,
  TextField,
  FormControl,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Stack,
  Typography,
} from '@mui/material';
import { DataContext } from '../DataContext';
import { AppCurrentVisits } from '../sections/@dashboard/app';
import { Helmet } from 'react-helmet-async';

/**
 * Component for displaying student attendance.
 */
export default function StudAttendance() {
  // State variables
  const [loading, setLoading] = useState(false);
  const { hellodata } = useContext(DataContext);
  const theme = useTheme();
  const [selectedCourse, setSelectedCourse] = useState('');
  const [attendanceData, setAttendanceData] = useState({});
  const [isNoDataPopupOpen, setIsNoDataPopupOpen] = useState(false);

  // Handle course selection
  const handleCourseChange = (event) => {
    setSelectedCourse(event.target.value);
  };

  // Set the initial selected course
  useEffect(() => {
    if (hellodata.details.studentCourses.coursesEnrolled[0]?.semesterCourses[0]?.courseCode) {
      setSelectedCourse(hellodata.details.studentCourses.coursesEnrolled[0].semesterCourses[0].courseCode);
    }
  }, [hellodata]);

  // Fetch attendance data when the selected course changes
  useEffect(() => {
    if (selectedCourse) {
      fetchAttendanceData();
    }
  }, [selectedCourse, hellodata]);

  // Fetch attendance data from the server
  const fetchAttendanceData = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://gradego-rtib.onrender.com/attendance/student', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          _id: hellodata.details.batchDetails._id,
          courseCode: selectedCourse,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setAttendanceData(data);
        setLoading(false);
      } else {
        // Handle error response
        console.log('Error:', response.status);
        setAttendanceData({});
        setLoading(false);
        setIsNoDataPopupOpen(true);
      }
    } catch (error) {
      // Handle fetch error
      console.log('Fetch Error:', error);
    }
  };

  // Close the no data popup
  const handleNoDataPopupClose = () => {
    setIsNoDataPopupOpen(false);
  };

  return (
    <>
      {/* Document Title */}
      <Helmet>
        <title>Student Attendance | GradeGo</title>
      </Helmet>

      {/* Attendance Heading */}
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4">Attendance</Typography>
      </Stack>

      {/* Course Selection */}
      <Grid item xs={12} md={6} lg={4} style={{ marginBottom: '2rem' }}>
        {/* Dropdown to select course */}
        <FormControl fullWidth style={{ marginBottom: '1.75rem' }}>
          <TextField
            id="course-select"
            select
            label="Select a Course"
            value={selectedCourse}
            onChange={handleCourseChange}
            SelectProps={{
              displayEmpty: true,
            }}
          >
            {hellodata.details.studentCourses.coursesEnrolled[0]?.semesterCourses.map((course) => (
              <MenuItem key={course._id} value={course.courseCode}>
                {course.courseCode}
              </MenuItem>
            ))}
          </TextField>
        </FormControl>

        {/* Loading Indicator */}
        {loading ? (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '300px', // Set a minimum height for the container
            }}
          >
            <CircularProgress />
          </div>
        ) : (
          /* Attendance Chart */
          <AppCurrentVisits
            title="Students Attendance"
            chartData={[
              { label: 'Present', value: attendanceData[0]?.presentDays || 0 },
              {
                label: 'Absent',
                value: attendanceData[0]?.totalDays ? attendanceData[0].totalDays - attendanceData[0].presentDays : 0,
              },
            ]}
            chartColors={[theme.palette.success.main, theme.palette.error.main]}
          />
        )}

        {/* No Data Popup */}
        <Dialog open={isNoDataPopupOpen} onClose={handleNoDataPopupClose}>
          <DialogTitle>No Data Available</DialogTitle>
          <DialogContent>
            <p>No attendance data is available for the selected course.</p>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleNoDataPopupClose} color="primary" autoFocus>
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </Grid>
    </>
  );
}
