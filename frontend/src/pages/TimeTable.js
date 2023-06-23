/*
  Timetable Component

  This component displays the timetable for a specific semester and batch.
  It allows users to view the timetable and make edits if necessary.

  Dependencies:
  - React
  - @mui/material components
  - react-helmet-async for managing the document title
  - DataContext for accessing shared data
*/

import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Button,
  MenuItem,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Select,
  Typography,
  Stack
} from '@mui/material';
import { Helmet } from 'react-helmet-async';

import { DataContext } from '../DataContext';

/*
  Timetable Component
*/
const Timetable = () => {
  // Access shared data using the DataContext
  const { hellodata } = useContext(DataContext);
  const { details, course } = hellodata;
  const navigate = useNavigate();
  useEffect(() => {
    const storedData = localStorage.getItem('hellodata');
    if (!storedData) {
      navigate('/login', { replace: true });
    }
  }, [])

  // State variables
  const [timetableData, setTimetableData] = useState({ days: [] });
  const [availableCourses, setAvailableCourses] = useState([]);

  /*
    Fetch timetable data from the backend when the details change.
    Update the timetableData state variable with the retrieved data.
  */
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("https://gradego-rtib.onrender.com/facdashboard/DisplayTimeTable", {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            semester: details.semesterHandled,
            batch: details.batchHandled
          }),
        });

        if (response.ok) {
          const timetableDataback = await response.json();
          setTimetableData(timetableDataback);
        } else {
          console.error('Failed to retrieve timetable data:', response.status);
        }
      } catch (error) {
        console.error('Error retrieving timetable data:', error);
      }
    };

    fetchData();
  }, [details]);

  /*
    Update the availableCourses state variable when the course changes.
  */
  useEffect(() => {
    setAvailableCourses(course);
  }, [course]);

  /*
    Log the timetableData whenever it changes.
  */
  useEffect(() => {
    console.log(timetableData);
  }, [timetableData]);

  /*
    Update the timetableData state variable when a course is selected for a specific period.
  */
  const handleTimetableChange = (dayIndex, periodIndex, courseAbbreviation) => {
    const updatedTimetable = { ...timetableData };
    updatedTimetable.days[dayIndex].periods[periodIndex].courseAbbreviation = courseAbbreviation;
    setTimetableData(updatedTimetable);
  };

  /*
    Submit the updated timetable to the backend for saving.
  */
  const handleSubmit = async () => {
    try {
      const response = await fetch('https://gradego-rtib.onrender.com/facdashboard/TimeTable', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          semester: details.semesterHandled,
          batch: details.batchHandled,
          days: timetableData.days.map((day) => ({
            day: day._id,
            periods: day.periods.map((period) => ({
              _id: period._id,
              courseCode: '',
              abbreviation: period.courseAbbreviation,
            })),
          })),
        }),
      });

      if (response.ok) {
        console.log('Timetable saved successfully');
        window.location.reload();
        // Do something on success
      } else {
        console.error('Error saving timetable:', response.status);
      }
    } catch (error) {
      console.error('Error saving timetable:', error);
    }
  };

  // State variables for managing view and edit modes
  const [viewTimeTableSet, setViewTimeTableSet] = useState(true);
  const [editTimeTableSet, setEditTimeTableSet] = useState(false);

  /*
    Switch to the edit mode
  */
  const handleEdit = () => {
    setEditTimeTableSet(true);
    setViewTimeTableSet(false);
  };

  return (
    <div>
      {/* Set the document title */}
      <Helmet>
        <title>Timetable | GradeGo</title>
      </Helmet>

      {/* View Mode */}
      {viewTimeTableSet && (
        <div>
          {/* Timetable header */}
          <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
            <Typography variant="h4">Timetable</Typography>
          </Stack>

          {/* Timetable table */}
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell style={{ border: '1px solid black' }}>Day</TableCell>
                  {/* Render table header cells for each period */}
                  {timetableData.days.length > 0 &&
                    timetableData.days[0].periods.map((period, index) => (
                      <TableCell
                        key={index}
                        style={{
                          border: '1px solid black',
                          textTransform: 'uppercase',
                          fontWeight: 'bold',
                          //   backgroundColor: index % 2 === 0 ? '#f5f5f5' : 'white',
                        }}
                      >
                        Period {period._id}
                      </TableCell>
                    ))}
                </TableRow>
              </TableHead>

              {/* Render table body rows for each day */}
              <TableBody>
                {timetableData.days.map((day, i) => (
                  <TableRow
                    key={i}
                    style={{
                      border: '1px solid black',
                      backgroundColor: i % 2 === 0 ? '#f5f5f5' : 'white',
                    }}
                  >
                    <TableCell
                      key={day._id}
                      style={{
                        border: '1px solid black',
                        textTransform: 'uppercase',
                        fontWeight: 'bold',
                      }}
                    >
                      {day._id}
                    </TableCell>
                    {/* Render table cells for each period */}
                    {day.periods.map((period, index) => (
                      <TableCell
                        key={index}
                        style={{
                          border: '1px solid black',
                          backgroundColor: i % 2 === 0 ? '#f5f5f5' : 'white',
                          color: period.courseAbbreviation ? 'black' : 'gray',
                        }}
                      >
                        {period.courseAbbreviation || 'No Class'}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Edit button */}
          <Button style={{ padding: '10px', marginTop: '10px' }} variant="contained" onClick={handleEdit}>
            Edit
          </Button>
        </div>
      )}

      {/* Edit Mode */}
      {editTimeTableSet && (
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Day</TableCell>
                {/* Render table header cells for each period */}
                {timetableData.days.length > 0 &&
                  timetableData.days[0].periods.map((period, index) => (
                    <TableCell key={index}>Period {period._id}</TableCell>
                  ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {/* Render table body rows for each day */}
              {timetableData.days.map((day, dayIndex) => (
                <TableRow key={day._id}>
                  <TableCell>
                    <Typography style={{ textTransform: 'uppercase' }}>
                      {day._id}
                    </Typography>
                  </TableCell>
                  {/* Render table cells for each period */}
                  {day.periods.map((period, periodIndex) => (
                    <TableCell key={periodIndex}>
                      {/* Dropdown menu to select a course */}
                      <Select
                        value={period.courseAbbreviation}
                        onChange={(e) =>
                          handleTimetableChange(dayIndex, periodIndex, e.target.value)
                        }
                      >
                        <MenuItem value="">Select Course</MenuItem>
                        {/* Render menu items for available courses */}
                        {availableCourses.map((course) => (
                          <MenuItem key={course._id} value={course.courseAbbreviation}>
                            {course.courseAbbreviation}
                          </MenuItem>
                        ))}
                      </Select>
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* Submit button */}
          <Button style={{ padding: '10px', marginTop: '10px' }} variant="contained" onClick={handleSubmit}>
            Submit
          </Button>
        </TableContainer>
      )}
    </div>
  );
};

export default Timetable;
