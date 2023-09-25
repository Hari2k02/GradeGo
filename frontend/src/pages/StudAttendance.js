import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import {
  Grid,
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
import Calendar from 'react-calendar'; // Import the react-calendar component
import 'react-calendar/dist/Calendar.css'; // Import the styles for the calendar

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
  const [markedDates, setMarkedDates] = useState({});

  const navigate = useNavigate();
  useEffect(() => {
    const storedData = localStorage.getItem('hellodata');
    if (!storedData) {
      navigate('/login', { replace: true });
    }
  }, []);

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
        setAttendanceData({}); // Set it to an empty object or appropriate initial value
        setLoading(false);
        setIsNoDataPopupOpen(true);
      }
    } catch (error) {
      // Handle fetch error
      console.log('Fetch Error:', error);
      setAttendanceData({}); // Set it to an empty object or appropriate initial value
      setLoading(false);
    }
  };

  useEffect(() => {
    if (attendanceData && Array.isArray(attendanceData.courseAttendance)) {
      const processedDates = {};

      for (const entry of attendanceData.courseAttendance) {
        const date = new Date(entry.date);
        const isPresent = entry.isPresent;
        //const hour = entry.hour;
        const dateString = date.toISOString().split('T')[0];

        // Set the color based on isPresent and handle multiple hours
        if (processedDates[dateString]) {
          if (isPresent) {
            processedDates[dateString].style = 'yellow'; // Student is present for some hours
          } else {
            processedDates[dateString].style = 'red'; // Student is absent for some hours
          }
        } else {
          processedDates[dateString] = {
            style: isPresent ? 'green' : 'red',
          };
        }
      }

      setMarkedDates(processedDates);
    } else {
      // Handle the case where the data is missing or not in the expected format
      console.error('Invalid or missing data in attendanceData');
    }
  }, [attendanceData]);

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
          {/* ... Existing code ... */}
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
              {
                label: 'Present',
                value: attendanceData?.output?.[0]?.presentDays || 0,
              },
              {
                label: 'Absent',
                value:
                  attendanceData?.output?.[0]?.totalDays - attendanceData?.output?.[0]?.presentDays || 0,
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
      {/* Calendar */}
      <div style={{ height: '100%', width: '100%' }}>
        <Calendar
          tileContent={({ date }) => {
            const dateString = date.toISOString().split('T')[0];
            const tileStyle = markedDates[dateString] || {};
            const cellStyle = {
              backgroundColor: tileStyle.style,
              borderRadius: '50%',
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            };

            return (
              <div style={cellStyle}>
                {tileStyle.style === 'green' && 'P'} {/* Display 'P' for green cells */}
                {tileStyle.style === 'red' && 'A'} {/* Display 'A' for red cells */}
                {tileStyle.style === 'yellow' && 'Y'} {/* Display 'Y' for yellow cells */}
              </div>
            );
          }}
        />
      </div>
    </>
  );
}
