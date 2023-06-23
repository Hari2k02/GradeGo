import React, { useState, useEffect, useContext } from 'react';
import { FacultyDataContext } from '../FacultyDataContext';
import {
    Typography,
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
    Stack,
    TextField,
    MenuItem,
    CircularProgress,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    FormControl,
    RadioGroup,
    FormControlLabel,
    Radio,
} from '@mui/material';
import { DataContext } from '../DataContext';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { Helmet } from 'react-helmet-async';

const TutorAttendanceReport = () => {
    const { facsemdata } = useContext(FacultyDataContext);
    const [selectedClass, setSelectedClass] = useState('');
    const [courses, setCourses] = useState([]);
    const [semester, setSemester] = useState(0);
    // const [courseCode, setCourseCode] = useState('');
    const [batch, setBatch] = useState(0);
    const [attendanceData, setAttendanceData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedFormat, setSelectedFormat] = useState('');
    const [isGeneratingReport, setIsGeneratingReport] = useState(false);


    const { hellodata } = useContext(DataContext);

    useEffect(() => {
    //     const fetchCourses = async () => {
    //         try {
    //             const response = await fetch('https://gradego-rtib.onrender.com/facdashboard/semesterCourses', {
    //                 method: 'POST',
    //                 headers: {
    //                     'Content-Type': 'application/json',
    //                 },
    //                 body: JSON.stringify({ _id: hellodata.name._id }),
    //             });

    //             if (response.ok) {
    //                 const data = await response.json();
    //                 setCourses(data);
    //                 setSelectedClass(data.length > 0 ? data[0]._id : '');
    //             } else {
    //                 console.error('Error fetching courses');
    //             }
    //         } catch (error) {
    //             console.error('Error fetching courses:', error);
    //         }
    //     };

    //     fetchCourses();
        setCourses(facsemdata.facultyDetails.coursesHandled);
        console.log(courses);
    //     setSelectedClass(courses.length > 0 ? courses[0].courseCode : '');

    }, []);

    useEffect(() => {
        const fetchAttendanceData = async () => {
            try {
                setIsLoading(true);

                const response = await fetch('https://gradego-rtib.onrender.com/facdashboard/studentAttendance', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ _id: hellodata.name._id,semester: semester, batch: batch,  courseCode: selectedClass }),
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

    const handleGenerateReport = () => {
        if (attendanceData.length === 0) {
            console.error('No attendance data available');
            return;
        }

        setOpenDialog(true);
    };


    const handleGenerateBatchExcelReport = async () => {
        try {
            setIsGeneratingReport(true);
            const response = await fetch('https://gradego-rtib.onrender.com/facdashboard/batchAttendanceReport', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ _id: hellodata.name._id }),
            });

            if (response.ok) {
                const data = await response.json();
                console.log('Batch attendance report generated:', data);

                const workbook = new ExcelJS.Workbook();
                const worksheet = workbook.addWorksheet('Batch Attendance Report');

                // Define column widths
                worksheet.getColumn(1).width = 12;
                worksheet.getColumn(2).width = 30;

                // Add headers for roll number and student name
                const headerRow = worksheet.addRow(['Roll Number', 'Student Name']);
                headerRow.font = { bold: true };
                headerRow.alignment = { horizontal: 'center' };

                // Add attendance data column headers for each course
                data.forEach((student) => {
                    student.courses.forEach((course, index) => {
                        const courseCode = course.courseCode;

                        // Calculate the column index based on the course index
                        const columnIndex = 3 + index * 3;

                        // Set column headers for present days, total days, and present percentage
                        worksheet.getCell(1, columnIndex).value = `${courseCode} - Present Days`;
                        worksheet.getCell(1, columnIndex).font = { bold: true };
                        worksheet.getCell(1, columnIndex).alignment = { horizontal: 'center' };
                        worksheet.getColumn(columnIndex).width = 15;

                        worksheet.getCell(1, columnIndex + 1).value = `${courseCode} - Total Days`;
                        worksheet.getCell(1, columnIndex + 1).font = { bold: true };
                        worksheet.getCell(1, columnIndex + 1).alignment = { horizontal: 'center' };
                        worksheet.getColumn(columnIndex + 1).width = 15;

                        worksheet.getCell(1, columnIndex + 2).value = `${courseCode} - Present Percentage`;
                        worksheet.getCell(1, columnIndex + 2).font = { bold: true };
                        worksheet.getCell(1, columnIndex + 2).alignment = { horizontal: 'center' };
                        worksheet.getColumn(columnIndex + 2).width = 15;
                    });
                });

                // Add attendance data for each student and course
                data.forEach((student, index) => {
                    const rowData = [index + 1, `${student.name.firstName} ${student.name.lastName}`];

                    // Add attendance data for each course
                    student.courses.forEach((course) => {
                        //const columnIndex = 3 + courseIndex * 3;
                        rowData.push(
                            course.presentDays,
                            course.totalDays,
                            course.totalDays === 0 ? 'N/A' : `${Math.round((course.presentDays / course.totalDays) * 100)}`
                        );
                    });

                    // Add row to worksheet
                    const dataRow = worksheet.addRow(rowData);
                    dataRow.alignment = { horizontal: 'center' };
                });

                // Auto-fit column widths to content
                worksheet.columns.forEach((column) => {
                    column.eachCell({ includeEmpty: true }, (cell) => {
                        const desiredWidth = Math.max((cell.value || '').toString().length + 2, 12); // Minimum column width of 12
                        column.width = Math.max(column.width, desiredWidth);
                    });
                });

                // Calculate the width of the last column based on the maximum content width
                const lastColumn = worksheet.getColumn(worksheet.columns.length);
                const maxContentWidth = lastColumn.width;
                const extraWidth = 10; // Additional width for padding
                lastColumn.width = Math.max(maxContentWidth + extraWidth, 20); // Set the minimum width to 20

                const fileName = 'Batch_Attendance_Report';
                workbook.xlsx.writeBuffer().then((buffer) => {
                    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
                    saveAs(blob, `${fileName}.xlsx`);
                });
            } else {
                console.error('Error generating batch attendance report');
            }
        } catch (error) {
            console.error('Error generating batch attendance report:', error);
        } finally {
            setIsGeneratingReport(false); // Set loading state to false
        }
    };

    const handleDialogClose = () => {
        setOpenDialog(false);
        setSelectedFormat('');
    };

    const handleDownload = () => {
        if (selectedFormat === 'pdf') {
            generatePDFReport();
        } else if (selectedFormat === 'xlsx') {
            generateExcelReport();
        }

        handleDialogClose();
    };

    const generateExcelReport = () => {
        const selectedCourse = courses.find((course) => course.courseCode === selectedClass);
        const fileName = `${selectedCourse.courseCode} - ${selectedCourse.courseName}`;

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

        workbook.xlsx.writeBuffer().then((buffer) => {
            const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            saveAs(blob, `${fileName}.xlsx`);
        });
    };

    const generatePDFReport = () => {
        const selectedCourse = courses.find((course) => course.courseCode === selectedClass);
        const fileName = `${selectedCourse.courseCode} - ${selectedCourse.courseName}`;

        const doc = new jsPDF();

        // Add title
        doc.setFontSize(16);
        doc.text('Attendance Report', 15, 15);

        // Add course details
        doc.setFontSize(12);
        doc.text(`${selectedCourse.courseCode} - ${selectedCourse.courseName}`, 15, 25);

        // Add table headers
        const headers = ['Roll Number', 'Student Name', 'Present Days', 'Total Days', 'Percentage Present'];
        const data = attendanceData.map((student, index) => [
            index + 1,
            `${student.name.name.firstName} ${student.name.name.lastName}`,
            student.presentDays,
            student.totalDays,
            student.totalDays === 0 ? 'N/A' : `${Math.round((student.presentDays / student.totalDays) * 100)}%`,
        ]);

        doc.autoTable({
            head: [headers],
            body: data,
            startY: 30,
        });

        doc.save(`${fileName}.pdf`);
    };

    return (
        <div>
            <Helmet>
                <title>Attendance Report | GradeGo</title>
            </Helmet>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Attendance Report
                </Typography>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleGenerateBatchExcelReport}
                    disabled={isGeneratingReport}
                    style={{ alignSelf: 'center', marginTop: '2rem' }}
                >
                    {isGeneratingReport ? (
                        <CircularProgress size={24} style={{ marginRight: '0.5rem' }} />
                    ) : (
                        'Generate Batch Attendance Report'
                    )}
                </Button>


            </div>

            {/* <Select value={selectedClass} onChange={handleClassChange} style={{ width: '100%', marginBottom: '3rem' }}>
                {courses.map((course) => (
                    <MenuItem key={course.courseCode} value={course.courseCode}>
                        {course.courseCode} - {course.courseName}
                    </MenuItem>
                ))}
            </Select> */}

            <Stack direction="row" spacing={2} alignItems="center" mb={3}>
                <TextField
                    select
                    fullWidth
                    label="Select Semester"
                    value={semester}
                    onChange={(event) => setSemester(event.target.value)}
                    variant="outlined"
                >
                    {Array.from(new Set(facsemdata.facultyDetails.coursesHandled.map((course) => course.semester))).map((semester) => (
                        <MenuItem key={semester} value={semester}>
                            Semester: {semester}
                        </MenuItem>
                    ))}
                </TextField>

                {semester > 0 && (
                    <>
                        <TextField
                            select
                            fullWidth
                            label="Select Batch"
                            value={batch}
                            onChange={(event) => setBatch(event.target.value)}
                            variant="outlined"
                        >
                            {Array.from(
                                new Set(
                                    facsemdata.facultyDetails.coursesHandled
                                        .filter((course) => course.semester === semester)
                                        .map((course) => course.batch)
                                )
                            ).map((batch) => (
                                <MenuItem key={batch} value={batch}>
                                    Batch: {batch}
                                </MenuItem>
                            ))}
                        </TextField>

                        <TextField
                            select
                            fullWidth
                            label="Select Course Code"
                            value={selectedClass}
                            onChange={(event) => {
                                setSelectedClass(event.target.value);
                                handleClassChange(event);
                            }}
                            variant="outlined"
                        >
                            {facsemdata.facultyDetails.coursesHandled
                                .filter((course) => course.semester === semester && course.batch === batch)
                                .map((course) => (
                                    <MenuItem key={course._id} value={course.courseCode}>
                                        Course Code: {course.courseCode}
                                    </MenuItem>
                                ))}
                        </TextField>
                    </>
                )}
            </Stack>




            {isGeneratingReport && (
                <div
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: 'rgba(255, 255, 255, 0.8)',
                        zIndex: 9999,
                    }}
                >
                    <CircularProgress />
                    <div style={{ marginLeft: '2rem' }}>
                        <Typography>Downloading Batch Attendance Report...</Typography>
                    </div>
                </div>
            )}


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

            <Dialog open={openDialog} onClose={handleDialogClose}>
                <DialogTitle>Download Format</DialogTitle>
                <DialogContent>
                    <FormControl component="fieldset">
                        <RadioGroup value={selectedFormat} onChange={(e) => setSelectedFormat(e.target.value)}>
                            <FormControlLabel value="pdf" control={<Radio />} label="PDF" />
                            <FormControlLabel value="xlsx" control={<Radio />} label="XLSX" />
                        </RadioGroup>
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDialogClose}>Cancel</Button>
                    <Button onClick={handleDownload} disabled={!selectedFormat}>
                        Download
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default TutorAttendanceReport;
