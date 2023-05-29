import React, { useState, useEffect, useContext } from 'react';
import { Button, MenuItem, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Select, Typography, Stack } from '@mui/material';
import { DataContext } from '../DataContext';

const Timetable = () => {
    const { hellodata } = useContext(DataContext);
    const { details, course } = hellodata;
    console.log(hellodata);
    const [timetableData, setTimetableData] = useState({ days: [] });
    const [availableCourses, setAvailableCourses] = useState([]);
    useEffect(() => {
        // Fetch timetable data from backend
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

    useEffect(() => {
        setAvailableCourses(course);
    }, [course]);

    useEffect(() => {
        console.log(timetableData)
    }
        , [timetableData])


    const handleTimetableChange = (dayIndex, periodIndex, courseAbbreviation) => {
        const updatedTimetable = { ...timetableData };
        updatedTimetable.days[dayIndex].periods[periodIndex].courseAbbreviation = courseAbbreviation;
        setTimetableData(updatedTimetable);
    };


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

    const [viewTimeTableSet, setViewTimeTableSet] = useState(true);
    const [editTimeTableSet, setEditTimeTableSet] = useState(false);

    const handleEdit = () => {

        setEditTimeTableSet(true);
        setViewTimeTableSet(false);
    }
    return (
        <div>
            {
                viewTimeTableSet && (
                    <div>
                        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
                            <Typography variant="h4">Timetable</Typography>
                        </Stack>
                        <TableContainer component={Paper}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell style={{ border: '1px solid black' }}>Day</TableCell>
                                        {timetableData.days.length > 0 &&
                                            timetableData.days[0].periods.map((period, index) => (
                                                <TableCell key={index} style={{ border: '1px solid black' }}>Period {period._id}</TableCell>
                                            ))}
                                    </TableRow>
                                </TableHead>

                                <TableBody>
                                    {
                                        timetableData.days.map((day, i) => (
                                            <TableRow key={i}>
                                                <TableCell key={day._id} style={{ border: '1px solid black' }}>
                                                    {day._id}
                                                </TableCell>
                                                {day.periods.map((period, index) => (
                                                    <TableCell key={index} style={{ border: '1px solid black' }}>{period.courseAbbreviation}</TableCell>
                                                ))}
                                            </TableRow>

                                        ))
                                    }
                                </TableBody>


                            </Table>
                        </TableContainer>
                        <Button style={{ padding: '10px', marginTop: '10px' }} variant="contained" onClick={handleEdit}>
                            Edit
                        </Button>
                    </div>
                )
            }
            {editTimeTableSet && (
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell >Day</TableCell>
                                {timetableData.days.length > 0 &&
                                    timetableData.days[0].periods.map((period, index) => (
                                        <TableCell key={index}>Period {period._id}</TableCell>
                                    ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {timetableData.days.map((day, dayIndex) => (
                                <TableRow key={day._id}>
                                    <TableCell>{day._id}</TableCell>
                                    {day.periods.map((period, periodIndex) => (
                                        <TableCell key={periodIndex}>
                                            <Select
                                                value={period.courseAbbreviation}
                                                onChange={(e) =>
                                                    handleTimetableChange(dayIndex, periodIndex, e.target.value)
                                                }
                                            >
                                                <MenuItem value="">Select Course</MenuItem>
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
                    <Button style={{ padding: '10px', marginTop: '10px' }} variant="contained" onClick={handleSubmit}>
                        Submit
                    </Button>
                </TableContainer>)
            }
        </div>
    );
};

export default Timetable;
