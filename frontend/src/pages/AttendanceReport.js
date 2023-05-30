import React, { useState, useEffect, useContext } from 'react';
import { Typography, Table, TableHead, TableBody, TableRow, TableCell, Select, MenuItem } from '@mui/material';
import { DataContext } from '../DataContext';

const AttendanceReport = () => {
  const [attendanceData, setAttendanceData] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [courses, setCourses] = useState([]);

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
          setSelectedClass(data.length > 0 ? data[0]._id : ''); // Set the first item as selected by default
        } else {
          // Handle error response
          console.error('Error fetching courses');
        }
      } catch (error) {
        // Handle fetch error
        console.error('Error fetching courses:', error);
      }
    };

    fetchCourses();
  }, []);

  const handleClassChange = (event) => {
    setSelectedClass(event.target.value);
  };

  const fetchAttendanceDetails = () => {
    // Replace this with your API call to fetch attendance data for the selected class
    const data = [
      { studentName: 'John Doe', attendanceStatus: 'Present' },
      { studentName: 'Jane Smith', attendanceStatus: 'Absent' },
      // Add more attendance details here
    ];
    setAttendanceData(data);
  };

  return (
    <div>
      <Typography variant="h4" component="h1" gutterBottom>
        Attendance Report
      </Typography>

      <Select value={selectedClass} onChange={handleClassChange} style={{ width: '100%' }}>
        {courses.map((course) => (
          <MenuItem key={course._id} value={course._id}>
            {course.courseName}
          </MenuItem>
        ))}
      </Select>

      {attendanceData.length > 0 && (
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Student Name</TableCell>
              <TableCell>Attendance Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {attendanceData.map((student, index) => (
              <TableRow key={index}>
                <TableCell>{student.studentName}</TableCell>
                <TableCell>{student.attendanceStatus}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
};

export default AttendanceReport;
