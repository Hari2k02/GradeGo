import React, { useState, useEffect, useContext } from 'react';
import { Typography, Table, TableHead, TableBody, TableRow, TableCell, Select, MenuItem } from '@mui/material';
import { DataContext } from '../DataContext';

const AttendanceReport = () => {
  const [selectedClass, setSelectedClass] = useState('');
  const [courses, setCourses] = useState([]);
  const [attendanceData, setAttendanceData] = useState([]);

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

  const handleClassChange = async (event) => {
    const selectedValue = event.target.value;
    setSelectedClass(selectedValue);

    try {
      const response = await fetch('http://localhost:1337/facdashboard/studentAttendance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ _id: hellodata.details._id, courseCode: selectedValue }),
      });

      if (response.ok) {
        const data = await response.json();
        setAttendanceData(data);
        console.log(data);
      } else {
        // Handle error response
        console.error('Error fetching attendance data');
      }
    } catch (error) {
      // Handle fetch error
      console.error('Error fetching attendance data:', error);
    }
  };

  return (
    <div>
      <Typography variant="h4" component="h1" gutterBottom>
        Attendance Report
      </Typography>

      <Select value={selectedClass} onChange={handleClassChange} style={{ width: '100%', marginBottom: '3rem' }}>
        {courses.map((course) => (
          <MenuItem key={course._id} value={course._id}>
            {course.courseName}
          </MenuItem>
        ))}
      </Select>

      {attendanceData.length > 0 && (
        <Table style={{ marginBottom: '2rem' }}>
          <TableHead>
            <TableRow>
              <TableCell>Student Name</TableCell>
              <TableCell>Present Days</TableCell>
              <TableCell>Total Days</TableCell>
              <TableCell>Percentage Present</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {attendanceData.map((student) => (
              <TableRow key={student._id}>
                <TableCell>{`${student.name.name.firstName} ${student.name.name.lastName}`}</TableCell>
                <TableCell>{student.presentDays}</TableCell>
                <TableCell>{student.totalDays}</TableCell>
                <TableCell>
                  {student.totalDays === 0
                    ? 'N/A' // Display 'N/A' if totalDays is 0
                    : `${Math.round((student.presentDays / student.totalDays) * 100)}%`}
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
