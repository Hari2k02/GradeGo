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

const AdminCourses = () => {
  const semesters = [1, 2, 3, 4, 5, 6, 7, 8];
  const [selectedSemester, setSelectedSemester] = useState('');
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedBatch, setSelectedBatch] = useState('');
  const [faculties, setFaculties] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  // const [selectedFaculty, setSelectedFaculty] = useState(null);
  const [selectedFaculties, setSelectedFaculties] = useState([]);
  const [batchSelected, setBatchSelected] = useState(false); // Track if batch is selected
  // const [submissionStatus, setSubmissionStatus] = useState(''); // Possible values: '', 'ok', 'error'
  // const [submissionMessage, setSubmissionMessage] = useState('');


  useEffect(() => {
    // Send GET request to fetch courses when the selected semester changes
    if (selectedSemester) {
      fetchCourses();
    }
  }, [selectedSemester]);

  const handleSemesterChange = (event) => {
    setSelectedSemester(event.target.value);
  };

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

  const handleCourseClick = (course) => {
    setSelectedCourse(course);
  };

  const handleBatchSelect = (event) => {
    setSelectedBatch(event.target.value);
    setBatchSelected(true); // Set batchSelected to true when a batch is selected
    setSelectedFaculties([]); // Reset selected faculties when a new batch is selected
    fetchFaculties(event.target.value);
  };

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

  const handleFacultySelect = (faculty) => {
    if (selectedFaculties.includes(faculty)) {
      setSelectedFaculties((prevSelectedFaculties) =>
        prevSelectedFaculties.filter((selectedFaculty) => selectedFaculty !== faculty)
      );
    } else {
      setSelectedFaculties((prevSelectedFaculties) => [...prevSelectedFaculties, faculty]);

    }
    // setSelectedFaculty(faculty);
  };

  useEffect(() => {
    console.log(selectedCourse);
  }, [selectedCourse])
  

  const handleDialogClose = () => {
    setSelectedCourse(null);
    setSelectedBatch('');
    setFaculties([]);
    setSearchQuery('');
    // setSelectedFaculty(null);
    setSelectedFaculties([]);
    setBatchSelected(false); // Reset batchSelected when closing the dialog
    // Reset the selected semester to allow selecting a new semester
    setSelectedSemester('');
    // Reset the courses data
    setCourses([]);
  };
  

  const handleSubmit = async () => {
    // Create an array of faculty details
    const facultyDetails = selectedFaculties.map((faculty) => ({
      _id: faculty._id,
      semester: selectedSemester,
      batch: selectedBatch,
      courseCode: selectedCourse._id,
    }));
  
    // Perform the POST request to save the data
    try {
      const response = await fetch('https://gradego-rtib.onrender.com/admin/facultyCourseAssignment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(facultyDetails), // Send the array of faculty details
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

  const handleSearchQueryChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const filterFacultiesByName = (faculty) => {
    const fullName = `${faculty.name.firstName} ${faculty.name.middleName} ${faculty.name.lastName}`;
    return fullName.toLowerCase().includes(searchQuery.toLowerCase());
  };

  return (
    <Container maxWidth="sm" style={{ marginTop: '20px', marginBottom: '20px' }}>
      <Typography variant="h4" align="center" gutterBottom style={{ marginBottom: '10px' }}>
        Faculty Courses
      </Typography>
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

      {courses.length > 0 && (
        <div style={{ marginTop: '10px' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Action</TableCell>
                {/* Add more table headers as needed */}
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
                  {/* Add more table cells with course data as needed */}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <Dialog open={selectedCourse !== null} onClose={handleDialogClose}>
        <DialogTitle>Select Batch and Faculties</DialogTitle>
        <DialogContent>
          <FormControl fullWidth style={{ marginBottom: '10px', minWidth: '120px' }}>
            <InputLabel id="batch-label">Batch</InputLabel>
            <Select
              labelId="batch-label"
              id="batch-select"
              value={selectedBatch}
              onChange={handleBatchSelect}
              label="Batch"
              //disabled={batchSelected}
            >
              <MenuItem value={1}>Batch 1</MenuItem>
              <MenuItem value={2}>Batch 2</MenuItem>
            </Select>
          </FormControl>

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
                  {faculties
                    .filter(filterFacultiesByName)
                    .map((faculty) => (
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
          <Button
            onClick={handleSubmit}
            variant="contained"
            color="primary"
            disabled={selectedFaculties.length === 0 || !batchSelected}
          >
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AdminCourses;
