import React, { useState, useEffect, useContext } from 'react';
import { Helmet } from 'react-helmet-async';
import { filter } from 'lodash';
import { sentenceCase } from 'change-case';
import { FacultyDataContext } from '../FacultyDataContext';


import {
  Card,
  Table,
  Stack,
  Paper,
  Avatar,
  Button,
  Popover,
  Checkbox,
  TableRow,
  MenuItem,
  TableHead,
  TableBody,
  TableCell,
  Container,
  Typography,
  IconButton,
  TableContainer,
  TablePagination,
  Select,
} from '@mui/material';
import Label from '../components/label';
import Scrollbar from '../components/scrollbar';


// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'rollNumber', label: 'Roll Number', alignRight: false },
  { id: 'name', label: 'Name', alignRight: false },
  { id: 'status', label: 'Attendance Status', alignRight: false },
  { id: '' },
];


export default function AttendanceSetting() {

  const { facsemdata } = useContext(FacultyDataContext);
  const [semester, setSemester] = useState('');
  const [batch, setBatch] = useState('');
  const [courseCode, setCourseCode] = useState('');
  const [userList, setUserList] = useState([]);
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('name');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [filteredStudents, setFilteredStudents] = useState(userList);

  useEffect(() => {
    const fetchData = async () => {
      const requestData = {
        semester: semester,
        batch: batch,
        courseCode: courseCode,
      };

      try {
        const response = await fetch('http://localhost:1337/tutor/attendancedata', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestData),
        });

        if (!response.ok) {
          throw new Error('Error: Fetch request failed');
        }

        const data = await response.json();
        setUserList(data);

      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    console.log(userList)
  }, [userList])


  useEffect(() => {
    function initialClick() {
      const newSelected = userList.map((n) => n.name.firstName);
      setSelected(newSelected);
      const updatedStudents = userList.map((student) => ({
        ...student,
        status: 'present',
      }));
      setFilteredStudents(updatedStudents);
    }
    initialClick();
  }, [userList]);

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = userList.map((n) => n.name.firstName);
      setSelected(newSelecteds);
      const updatedStudents = userList.map((student) => ({
        ...student,
        status: 'present',
      }));
      setFilteredStudents(updatedStudents);
      return;
    }

    setSelected([]);
    const updatedStudents = userList.map((student) => ({
      ...student,
      status: 'absent',
    }));
    setFilteredStudents(updatedStudents);
  };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else {
      newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
    }

    const updatedStudents = userList.map((student) => {
      if (newSelected.includes(student.name.firstName)) {
        return {
          ...student,
          status: 'present',
        };
      } else {
        return {
          ...student,
          status: 'absent',
        };
      }
    });

    setSelected(newSelected);
    setFilteredStudents(updatedStudents);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - filteredStudents.length) : 0;



  return (
    <>
      <div>
        <Helmet>
          <title>Attendance Settings</title>
        </Helmet>
        <Container>
          <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
            <Typography variant="h4">Attendance Settings</Typography>
          </Stack>
          <Stack direction="row" spacing={2}>
            <Typography variant="subtitle1">Select Semester:</Typography>
            <Select value={semester} onChange={(e) => setSemester(e.target.value)}>
              {facsemdata.facultyDetails.coursesHandled.map((course) => (
                <MenuItem key={course._id} value={course.semester}>
                  {course.semester}
                </MenuItem>
              ))}
            </Select>

            <Typography variant="subtitle1">Select Batch:</Typography>
            <Select value={batch} onChange={(e) => setBatch(e.target.value)}>
              {facsemdata.facultyDetails.coursesHandled.map((course) => (
                <MenuItem key={course._id} value={course.batch}>
                  {course.batch}
                </MenuItem>
              ))}
            </Select>

            <Typography variant="subtitle1">Select Course Code:</Typography>
            <Select value={courseCode} onChange={(e) => setCourseCode(e.target.value)}>
              {facsemdata.facultyDetails.coursesHandled.map((course) => (
                <MenuItem key={course._id} value={course.courseCode}>
                  {course.courseCode}
                </MenuItem>
              ))}
            </Select>
          </Stack>


          <Card>
            <Scrollbar>
              <TableContainer sx={{ minWidth: 800 }}>
                <Table>
                  <TableHead>
                    <TableRow>

                      {TABLE_HEAD.map((headCell) => (
                        <TableCell
                          key={headCell.id}
                          align={headCell.alignRight ? 'right' : 'left'}
                          sortDirection={orderBy === headCell.id ? order : false}
                        >
                          {headCell.label}
                        </TableCell>
                      ))}

                      <TableCell padding="checkbox">
                        <Checkbox
                          color="primary"
                          indeterminate={selected.length > 0 && selected.length < filteredStudents.length}
                          checked={filteredStudents.length > 0 && selected.length === filteredStudents.length}
                          onChange={handleSelectAllClick}
                          inputProps={{ 'aria-label': 'select all desserts' }}
                        />
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredStudents
                      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      .map((row, index) => {
                        const { _id, name, rollNumber, status } = row;
                        const isItemSelected = selected.indexOf(name.firstName) !== -1;

                        return (
                          <TableRow
                            hover
                            key={_id}
                            tabIndex={-1}
                            role="checkbox"
                            selected={isItemSelected}
                            aria-checked={isItemSelected}
                          >

                            <TableCell>{index + 1}</TableCell>
                            <TableCell>
                              <Stack direction="row" alignItems="center" spacing={2}>
                                <Avatar alt={name.firstName} src={`/assets/images/avatars/avatar_${index + 1}.jpg`} />
                                <Typography variant="subtitle2" noWrap>
                                  {`${name.firstName} ${name.lastName}`}
                                </Typography>
                              </Stack>
                            </TableCell>
                            <TableCell>
                              <Label
                                variant={status === 'present' ? 'filled' : 'outlined'}
                                color={status === 'present' ? 'success' : 'error'}
                              >
                                {sentenceCase(status)}
                              </Label>
                            </TableCell>
                            <TableCell padding="checkbox">
                              <Checkbox
                                color="primary"
                                checked={isItemSelected}
                                onChange={(event) => handleClick(event, name.firstName)}
                                inputProps={{ 'aria-labelledby': _id }}
                              />
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    {emptyRows > 0 && (
                      <TableRow style={{ height: 53 * emptyRows }}>
                        <TableCell colSpan={6} />
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>

              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={filteredStudents.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </Scrollbar>
          </Card>
        </Container>
      </div>
    </>
  );
}