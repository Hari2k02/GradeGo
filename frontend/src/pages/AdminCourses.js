/*
  This file contains the implementation of the AdminCourses component.
  It renders a form to manage faculty courses, allowing the selection of a semester,
  displaying courses for the selected semester, and assigning faculties to the selected course and batch.
*/

import React, { useEffect, useState } from 'react';
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
  Container,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from '@mui/material';
import { Helmet } from 'react-helmet-async';

/**
 * The AdminCourses component renders a form to manage faculty courses.
 */
const AdminCourses = () => {
  // Array of available semesters
  const semesters = [1, 2, 3, 4, 5, 6, 7, 8];

  // State variables
  const [selectedSemester, setSelectedSemester] = useState(semesters[0]);
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedBatch, setSelectedBatch] = useState('');
  const [faculties, setFaculties] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFaculties, setSelectedFaculties] = useState([]);
  const [batchSelected, setBatchSelected] = useState(false);

  /**
   * useEffect hook to fetch courses when the selected semester changes.
   */
  useEffect(() => {
    if (selectedSemester) {
      fetchCourses();
    }
  }, [selectedSemester]);

  /**
   * Event handler for semester change.
   * Updates the selected semester state.
   * @param {object} event - The event object
   */
  const handleSemesterChange = (event) => {
    setSelectedSemester(event.target.value);
  };

  /**
   * Fetches courses for the selected semester using an asynchronous function.
   */
  const fetchCourses = async () => {
    try {
      const response = await fetch('https://gradego-rtib.onrender.com/admin/semesterCourses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ semester: selectedSemester }),
      });

      if (response.ok) {
        const data = await response.json();
        setCourses(data.semesterCourses);
        setFaculties(data.faculties);
      } else {
        console.error('Error:', response.statusText);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  useEffect(() => {
    console.log(courses);
  }, [courses]);

  /**
   * Event handler for course selection.
   * Updates the selected course state.
   * @param {object} course - The selected course object
   */
  const handleCourseClick = (course) => {
    setSelectedCourse(course);
  };

  /**
   * Event handler for batch selection.
   * Updates the selected batch state.
   * @param {object} event - The event object
   */
  const handleBatchSelect = (event) => {
    setSelectedBatch(event.target.value);
    setBatchSelected(true);
    setSelectedFaculties([]);
    fetchFaculties(event.target.value);
  };

  /**
   * Fetches faculties for the selected batch using an asynchronous function.
   * @param {string} selectedBatch - The selected batch value
   */
  const fetchFaculties = async (selectedBatch) => {
    try {
      const response = await fetch('https://gradego-rtib.onrender.com/admin/semesterCourses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ semester: selectedSemester, batch: selectedBatch }),
      });

      if (response.ok) {
        const data = await response.json();
        setFaculties(data.faculties);
      } else {
        console.error('Error:', response.statusText);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  useEffect(() => {
    console.log(faculties);
  }, [faculties]);

  /**
   * Event handler for faculty selection.
   * Updates the selected faculties state.
   * @param {object} faculty - The selected faculty object
   */
  const handleFacultySelect = (faculty) => {
    if (selectedFaculties.includes(faculty)) {
      setSelectedFaculties((prevSelectedFaculties) =>
        prevSelectedFaculties.filter((selectedFaculty) => selectedFaculty !== faculty)
      );
    } else {
      setSelectedFaculties((prevSelectedFaculties) => [...prevSelectedFaculties, faculty]);
    }
  };

  useEffect(() => {
    console.log(selectedCourse);
  }, [selectedCourse]);

  /**
   * Event handler for closing the dialog.
   * Resets the state variables.
   */
  const handleDialogClose = () => {
    setSelectedCourse(null);
    setSelectedBatch('');
    setFaculties([]);
    setSearchQuery('');
    setSelectedFaculties([]);
    setBatchSelected(false);
    setSelectedSemester('');
    setCourses([]);
  };

  /**
   * Event handler for form submission.
   * Performs a POST request to save the faculty course assignments.
   */
  const handleSubmit = async () => {
    const facultyDetails = selectedFaculties.map((faculty) => ({
      _id: faculty._id,
      semester: selectedSemester,
      batch: selectedBatch,
      courseCode: selectedCourse._id,
    }));

    try {
      const response = await fetch('https://gradego-rtib.onrender.com/admin/facultyCourseAssignment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(facultyDetails),
      });

      if (response.ok) {
        console.log('Data saved successfully');
        handleDialogClose();
      } else {
        console.error('Error:', response.statusText);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  /**
   * Event handler for search query change.
   * Updates the search query state.
   * @param {object} event - The event object
   */
  const handleSearchQueryChange = (event) => {
    setSearchQuery(event.target.value);
  };

  /**
   * Filters faculties by name based on the search query.
   * @param {object} faculty - The faculty object
   * @returns {boolean} - True if the faculty name matches the search query, false otherwise
   */
  const filterFacultiesByName = (faculty) => {
    const fullName = `${faculty.name.firstName} ${faculty.name.middleName} ${faculty.name.lastName}`;
    return fullName.toLowerCase().includes(searchQuery.toLowerCase());
  };

  return (
    <>
      {/* Document title */}
      <Helmet>
        <title>Course Setting | GradeGo</title>
      </Helmet>

      <Container maxWidth="sm" style={{ marginTop: '20px', marginBottom: '20px' }}>
        {/* Page heading */}
        <Typography variant="h4" align="center" gutterBottom style={{ marginBottom: '10px' }}>
          Faculty Courses
        </Typography>

        {/* Semester selection */}
        <FormControl fullWidth style={{ marginBottom: '10px', minWidth: '120px' }}>
          <InputLabel id="semester-label">Semester</InputLabel>
          <Select
            labelId="semester-label"
            id="semester-select"
            value={selectedSemester}
            onChange={handleSemesterChange}
            label="Semester"
          >
            {semesters.map((semester) => (
              <MenuItem key={semester} value={semester}>
                Semester {semester}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Course table */}
        {courses.length > 0 && (
          <div style={{ marginTop: '10px' }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {courses.map((course) => (
                  <TableRow key={course._id}>
                    <TableCell>{course._id}</TableCell>
                    <TableCell>{course.courseName}</TableCell>
                    <TableCell>
                      <Button variant="outlined" onClick={() => handleCourseClick(course)}>
                        Select Batch
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        {/* Dialog for batch and faculty selection */}
        <Dialog open={selectedCourse !== null} onClose={handleDialogClose}>
          <DialogTitle>Select Batch and Faculties</DialogTitle>
          <DialogContent>
            {/* Batch selection */}
            <FormControl fullWidth style={{ marginBottom: '10px', minWidth: '120px' }}>
              <InputLabel id="batch-label">Batch</InputLabel>
              <Select
                labelId="batch-label"
                id="batch-select"
                value={selectedBatch}
                onChange={handleBatchSelect}
                label="Batch"
              >
                <MenuItem value={1}>Batch 1</MenuItem>
                <MenuItem value={2}>Batch 2</MenuItem>
              </Select>
            </FormControl>

            {/* Faculty search and selection */}
            {batchSelected && (
              <>
                <TextField
                  label="Search Faculties"
                  value={searchQuery}
                  onChange={handleSearchQueryChange}
                  fullWidth
                  style={{ marginBottom: '10px' }}
                />

                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>ID</TableCell>
                      <TableCell>Name</TableCell>
                      <TableCell>Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {faculties.filter(filterFacultiesByName).map((faculty) => (
                      <TableRow key={faculty._id}>
                        <TableCell>{faculty._id}</TableCell>
                        <TableCell>{`${faculty.name.firstName} ${faculty.name.middleName} ${faculty.name.lastName}`}</TableCell>
                        <TableCell>
                          <Button
                            variant="outlined"
                            onClick={() => handleFacultySelect(faculty)}
                            style={{
                              backgroundColor: selectedFaculties.includes(faculty) ? 'green' : '',
                              color: selectedFaculties.includes(faculty) ? 'white' : '',
                            }}
                          >
                            {selectedFaculties.includes(faculty) ? 'Selected' : 'Select Faculty'}
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                    {faculties.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={2}>
                          <Typography variant="body1" align="center" style={{ marginTop: '10px' }}>
                            No matching faculties found.
                          </Typography>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDialogClose}>Cancel</Button>
            <Button variant="contained" onClick={handleSubmit} disabled={selectedFaculties.length === 0}>
              Save
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </>
  );
};

export default AdminCourses;
