import React, { useState, useEffect, useContext } from 'react';
import {
  Typography,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Select,
  MenuItem,
  CircularProgress,
} from '@mui/material';
import { DataContext } from '../DataContext';

const AttendanceReport = () => {
  const [selectedClass, setSelectedClass] = useState('');
  const [courses, setCourses] = useState([]);
  const [attendanceData, setAttendanceData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const { hellodata } = useContext(DataContext);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch('http://localhost:1337/facdashboard/semesterCourses', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ _id: hellodata.details._id }),
        });

        if (response.ok) {
          const data = await response.json();
          setCourses(data);
          setSelectedClass(data.length > 0 ? data[0]._id : '');
        } else {
          console.error('Error fetching courses');
        }
      } catch (error) {
        console.error('Error fetching courses:', error);
      }
    };

    fetchCourses();
  }, []);

  useEffect(() => {
    const fetchAttendanceData = async () => {
      try {
        setIsLoading(true);

        const response = await fetch('http://localhost:1337/facdashboard/studentAttendance', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ _id: hellodata.details._id, courseCode: selectedClass }),
        });

        if (response.ok) {
          const data = await response.json();
          setAttendanceData(data);
          console.log(data);
        } else {
          console.error('Error fetching attendance data');
        }
      } catch (error) {
        console.error('Error fetching attendance data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (selectedClass) {
      fetchAttendanceData();
    }
  }, [selectedClass]);

  const handleClassChange = (event) => {
    setSelectedClass(event.target.value);
  };

  return (
    <div>
      <Typography variant="h4" component="h1" gutterBottom>
        Attendance Report
      </Typography>

      <Select value={selectedClass} onChange={handleClassChange} style={{ width: '100%', marginBottom: '3rem' }}>
        {courses.map((course) => (
          <MenuItem key={course._id} value={course._id}>
            {course._id} - {course.courseName}
          </MenuItem>
        ))}
      </Select>

      {isLoading ? (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '300px',
            flexDirection: 'column',
            gap: '1rem',
          }}
        >
          <CircularProgress />
          <Typography>Loading Attendance Data...</Typography>
        </div>
      ) : attendanceData.length === 0 ? (
        <Typography>No attendance data available.</Typography>
      ) : (
        <Table style={{ marginBottom: '2rem' }}>
          <TableHead>
            <TableRow>
              <TableCell align="center">Roll Number</TableCell>
              <TableCell align="center">Student Name</TableCell>
              <TableCell align="center">Present Days</TableCell>
              <TableCell align="center">Total Days</TableCell>
              <TableCell align="center">Percentage Present</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {attendanceData.map((student, index) => (
              <TableRow key={student._id}>
                <TableCell align="center">{index + 1}</TableCell>
                <TableCell align="center">{`${student.name.name.firstName} ${student.name.name.lastName}`}</TableCell>
                <TableCell align="center">{student.presentDays}</TableCell>
                <TableCell align="center">{student.totalDays}</TableCell>
                <TableCell align="center">
                  {student.totalDays === 0 ? 'N/A' : `${Math.round((student.presentDays / student.totalDays) * 100)}%`}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
};

export default AttendanceReport;
