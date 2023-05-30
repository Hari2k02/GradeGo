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
  Button,
} from '@mui/material';
import { DataContext } from '../DataContext';
import ExcelJS from 'exceljs';

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

  const handleGenerateReport = async () => {
    if (attendanceData.length === 0) {
      console.error('No attendance data available');
      return;
    }
  
    const selectedCourse = courses.find((course) => course._id === selectedClass);
    const fileName = `${selectedCourse._id} - ${selectedCourse.courseName}.xlsx`;
  
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet(selectedCourse.courseName);
  
    // Define column widths
    worksheet.getColumn(1).width = 12;
    worksheet.getColumn(2).width = 30;
    worksheet.getColumn(3).width = 15;
    worksheet.getColumn(4).width = 15;
    worksheet.getColumn(5).width = 20;
  
    // Add headers with formatting
    const headerRow = worksheet.addRow([
      'Roll Number',
      'Student Name',
      'Present Days',
      'Total Days',
      'Percentage Present',
    ]);
    headerRow.font = { bold: true };
    headerRow.alignment = { horizontal: 'center' };
    // Add data rows with formatting
    attendanceData.forEach((student, index) => {
      const dataRow = worksheet.addRow([
        index + 1,
        `${student.name.name.firstName} ${student.name.name.lastName}`,
        student.presentDays,
        student.totalDays,
        student.totalDays === 0 ? 'N/A' : `${Math.round((student.presentDays / student.totalDays) * 100)}`,
      ]);
      dataRow.alignment = { horizontal: 'center' };
    });
    // Auto-fit column widths to content
    worksheet.columns.forEach((column) => {
      column.width = Math.max(column.width, 12); // Minimum column width of 12
    });
    const buffer = await workbook.xlsx.writeBuffer();
    saveAsExcelFile(buffer, fileName);
  };
  

  const saveAsExcelFile = (buffer, fileName) => {
    const data = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

    if (navigator.msSaveBlob) {
      // IE workaround
      navigator.msSaveBlob(data, fileName);
    } else {
      // For modern browsers
      const url = window.URL.createObjectURL(data);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
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
        <>
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
          <Button variant="contained" color="primary" onClick={handleGenerateReport} style={{ display: 'block', margin: 'auto' }}>
            Generate course attendance report
          </Button>
        </>
      )}
    </div>
  );
};

export default AttendanceReport;
