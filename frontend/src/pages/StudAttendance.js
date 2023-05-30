import React, { useState, useEffect, useContext } from 'react';
import { useTheme } from '@mui/material/styles';
import { Grid,  MenuItem, TextField, FormControl, CircularProgress, Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import { DataContext } from '../DataContext';

import {
  AppCurrentVisits,
} from '../sections/@dashboard/app';

export default function StudAttendance() {
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

  useEffect(() => {
    if (selectedCourse) {
      // Fetch attendance data
      fetchAttendanceData();
    }
  }, [selectedCourse, hellodata]);

  const fetchAttendanceData = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://gradego-rtib.onrender.com/attendance/student', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ktuId: hellodata.details.batchDetails._id,
          courseCode: selectedCourse
        })
      });

      if (response.ok) {
        const data = await response.json();
        setAttendanceData(data);
        setLoading(false);
      }

      else {
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

  const handleNoDataPopupClose = () => {
    setIsNoDataPopupOpen(false);
  };

  return (
    <>
      <Grid item xs={12} md={6} lg={4}>
        {/* Dropdown to select course */}

        <FormControl fullWidth>
          <TextField
            id="course-select"
            select
            label="Select a Course"
            value={selectedCourse}
            onChange={handleCourseChange}
            SelectProps={{
              displayEmpty: true
            }}
          >
            {hellodata.details.studentCourses.coursesEnrolled[0].semesterCourses.map((course) => (
              <MenuItem key={course._id} value={course.courseCode}>
                {course.courseCode}
              </MenuItem>
            ))}
          </TextField>
        </FormControl>

        {loading ? (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '300px', // Set a minimum height for the container
          }}>
            <CircularProgress />
          </div>
        ) : (
          <AppCurrentVisits
            title="Students Attendance"
            chartData={[
              { label: 'Present', value: attendanceData?.presentCount || 0 },
              { label: 'Absent', value: attendanceData?.totalAttendanceLength ? attendanceData.totalAttendanceLength - attendanceData.presentCount : 0 },
            ]}
            chartColors={[
              theme.palette.success.main,
              theme.palette.error.main,
            ]}
          />
        )}

        {/* No data popup */}
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
