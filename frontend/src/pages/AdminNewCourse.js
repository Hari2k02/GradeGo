import React, { useState } from 'react';
import {
    Typography,
    Container,
    TextField,
    Button,
    Grid,
    FormControl,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    CircularProgress
} from '@mui/material';
import { styled } from '@mui/material/styles';

const HeadingTypography = styled(Typography)({
    textAlign: 'center',
    marginBottom: '3rem',
    marginTop: '1rem',
});



const NewCourse = () => {
    const [courseData, setCourseData] = useState({
        _id: '',
        courseName: '',
        courseAbbreviation: '',
        category: '',
        lecture: null,
        tutorial: null,
        practical : null,
        credits: 0,
        yearOfIntroduction: null,
        courseDescription: '',
        department: '',
        semester: 0,
        courseOutcomes: [{coNo: null, coDescription : ''}],
        questionPapers:[{ nameOfPaper: '', DateOfExamination : null,questionPaper: ''}],
        syllabus: ''

    });
    const [isSubmitSuccess, setIsSubmitSuccess] = useState(null); // Manage submission success
    const [isSubmitting, setIsSubmitting] = useState(false);
    

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setCourseData({
            ...courseData,
            [name]: value,
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsSubmitting(true);
        try {
            const response = await fetch('https://gradego-rtib.onrender.com/admin/newCourse', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(courseData),
            });

            if (response.status === 200) {
                setIsSubmitSuccess(true);
                setCourseData({
                    _id: '',
                    courseName: '',
                    courseAbbreviation: '',
                    credits: 0,
                    semester: 0,
                });
            } else {
                setIsSubmitSuccess(false);
            }
        } catch (error) {
            console.error('An error occurred:', error);
            setIsSubmitSuccess(false);
        }
        finally{
            setIsSubmitting(false);
        }
    };
    const resetForm = () => {
        // Reset the form and hide the dialog
        setCourseData({
            _id: '',
            courseName: '',
            courseAbbreviation: '',
            credits: 0,
            semester: 0,
        });
        setIsSubmitSuccess(null);
    };

    return (
        <Container>
            <HeadingTypography variant='h4'>New Course</HeadingTypography>

            <form
                onSubmit={handleSubmit}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <FormControl fullWidth>
                            <TextField
                                label='Course Code'
                                name='_id'
                                value={courseData._id}
                                onChange={handleInputChange}
                                required
                            />
                        </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                        <FormControl fullWidth>
                            <TextField
                                label='Course Name'
                                name='courseName'
                                value={courseData.courseName}
                                onChange={handleInputChange}
                                required
                            />
                        </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                        <FormControl fullWidth>
                            <TextField
                                label='Abbreviation'
                                name='courseAbbreviation'
                                value={courseData.courseAbbreviation}
                                onChange={handleInputChange}
                                required
                            />
                        </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                        <FormControl fullWidth>
                            <TextField
                                label='Credits'
                                name='credits'
                                type='number'
                                value={courseData.credits}
                                onChange={handleInputChange}
                                required
                            />
                        </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                        <FormControl fullWidth>
                            <TextField
                                label='Semester'
                                name='semester'
                                type='number'
                                value={courseData.semester}
                                onChange={handleInputChange}
                                required
                            />
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} style={{ display: 'flex', justifyContent: 'center' }}>
                        <Button type="submit" variant="contained" color="primary">
                            Submit
                        </Button>
                    </Grid>
                </Grid>
            </form>

            {/* Loading screen */}
            {isSubmitting && (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '1rem' }}>
                    <CircularProgress />
                </div>
            )}

            {/* Submission status dialog */}
            <Dialog open={isSubmitSuccess !== null} onClose={resetForm}>
                <DialogTitle>
                    {isSubmitSuccess ? 'Submission Successful' : 'Submission Failed'}
                </DialogTitle>
                <DialogContent>
                    {isSubmitSuccess ? (
                        <p>The course data has been submitted successfully.</p>
                    ) : (
                        <p>There was an error submitting the course data. Please try again later.</p>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={resetForm} color='primary'>
                        Close
                    </Button>
                    {isSubmitSuccess && (
                        <Button onClick={resetForm} color='primary'>
                            New Entry
                        </Button>
                    )}
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default NewCourse;
