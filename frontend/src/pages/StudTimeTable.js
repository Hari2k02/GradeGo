/*
  Component: Timetable
  Description: This component displays the timetable for a specific semester and batch.
*/

import React, { useState, useEffect, useContext } from 'react';
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Stack } from '@mui/material';
import { DataContext } from '../DataContext';
import { Helmet } from 'react-helmet-async';

const Timetable = () => {
    // Accessing the global data context
    const { hellodata } = useContext(DataContext);
    const { details } = hellodata;

    // State variable to store the timetable data
    const [timetableData, setTimetableData] = useState({ days: [] });

    useEffect(() => {
        // Fetch timetable data from the backend
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
            {/* Set the document title */}
            <Helmet>
                <title>Timetable | GradeGo</title>
            </Helmet>

            {/* Render timetable if data is available */}
            {timetableData.days.length > 0 && (
                <div>
                    {/* Timetable header */}
                    <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
                        <Typography variant="h4">Timetable</Typography>
                    </Stack>

                    {/* Timetable table */}
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                {/* Table header row */}
                                <TableRow>
                                    <TableCell style={{ border: '1px solid black' }}>Day</TableCell>
                                    {/* Render table header cells for each period */}
                                    {timetableData.days[0].periods.map((period, index) => (
                                        <TableCell key={index} style={{ border: '1px solid black' }}>
                                            Period {period._id}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            </TableHead>

                            <TableBody>
                                {/* Render table body rows for each day */}
                                {timetableData.days.map((day, i) => (
                                    <TableRow key={i}>
                                        {/* Day cell */}
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
                </div>
            )}
        </div>
    );
};

export default Timetable;

