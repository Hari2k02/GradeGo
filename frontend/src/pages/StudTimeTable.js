import React, { useState, useEffect, useContext } from 'react';
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Stack } from '@mui/material';
import { DataContext } from '../DataContext';
import { Helmet } from 'react-helmet-async';

const Timetable = () => {
    const { hellodata } = useContext(DataContext);
    const { details} = hellodata;
    console.log(hellodata);
    const [timetableData, setTimetableData] = useState({ days: [] });

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
                        semester: details.studentCourses.coursesEnrolled[0].semester,
                        batch: details.batchDetails.batch
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
        console.log(timetableData);
    }, [timetableData]);

    return (
        <div>
            <Helmet>
                <title>Timetable | GradeGo</title>
            </Helmet>
            {
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
                                {timetableData.days.map((day, i) => (
                                    <TableRow key={i}>
                                        <TableCell
                                            key={day._id}
                                            style={{
                                                border: '1px solid black',
                                                textTransform: 'uppercase',
                                                fontWeight: 'bold',
                                                backgroundColor: i % 2 === 0 ? '#f5f5f5' : 'white',
                                            }}
                                        >
                                            {day._id}
                                        </TableCell>
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
                </div>
            }
        </div>
    );
};

export default Timetable;
