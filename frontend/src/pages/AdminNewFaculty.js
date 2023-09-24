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
    CircularProgress, // Add CircularProgress for loading indicator
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';

const HeadingTypography = styled(Typography)({
    textAlign: 'center',
    marginBottom: '3rem',
    marginTop: '1rem',
});

const NewFaculty = () => {
    const [facultyData, setFacultyData] = useState({
        ktuId: '',
        name: { firstName: '', middleName: '', lastName: '' },
        email: '',
        password: '1234',
        phoneNumber: '',
        dob: null,
        gender: '',
        department: '',
        staffType: '',
        roles: [], // Store roles as an array of strings
    });

    const [selectedRoles, setSelectedRoles] = useState([]);
    const [isRoleDialogOpen, setIsRoleDialogOpen] = useState(false);
    const [isNameDialogOpen, setIsNameDialogOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false); // Add loading state
    const [isSubmitSuccess, setIsSubmitSuccess] = useState(null); // Add submit success state

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        if (name === 'firstName' || name === 'middleName' || name === 'lastName') {
            setFacultyData({
                ...facultyData,
                name: {
                    ...facultyData.name,
                    [name]: value,
                },
            });
        } else {
            setFacultyData({
                ...facultyData,
                [name]: value,
            });
        }
    };

    const handleNameDialogOpen = () => {
        setIsNameDialogOpen(true);
    };

    const handleNameDialogClose = () => {
        setIsNameDialogOpen(false);
    };

    const handleRoleDialogOpen = () => {
        setIsRoleDialogOpen(true);
    };

    const handleRoleDialogClose = () => {
        setIsRoleDialogOpen(false);
    };

    const handleRoleToggle = (role) => {
        if (selectedRoles.includes(role)) {
            setSelectedRoles(selectedRoles.filter((r) => r !== role));
        } else {
            setSelectedRoles([...selectedRoles, role]);
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (isValidFacultyData(facultyData)) {
            setIsLoading(true); // Show loading indicator

            // Modify roles to match the desired schema
            const modifiedRoles = selectedRoles.map((role) => ({ roleName: role }));

            // Create the faculty data object to be sent to the backend
            const facultyDataToSave = {
                _id: facultyData.ktuId,
                name: facultyData.name,
                email: facultyData.email,
                password: facultyData.password,
                phoneNumber: facultyData.phoneNumber,
                dob: facultyData.dob,
                gender: facultyData.gender,
                department: facultyData.department,
                staffType: facultyData.staffType,
                roles: modifiedRoles, // Use the modified roles array
            };
            console.log(facultyDataToSave);

            try {
                // Send facultyDataToSave to your backend API using a POST request
                const response = await fetch('https://gradego-rtib.onrender.com/admin/newFaculty', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(facultyDataToSave),
                });

                if (response.status === 200) {
                    // Successful submission
                    console.log('Faculty data saved successfully.');
                    setIsSubmitSuccess(true);
                } else {
                    // Handle errors or show error messages
                    console.error('Error saving faculty data.');
                    setIsSubmitSuccess(false);
                }
            } catch (error) {
                console.error('An error occurred:', error);
                setIsSubmitSuccess(false);
            }

            setIsLoading(false); // Hide loading indicator
        } else {
            // Handle invalid data (e.g., show error messages)
        }
    };

    const isValidFacultyData = (data) => {
        return (
            data.name.firstName.trim() !== '' &&
            data.name.lastName.trim() !== '' &&
            data.email.trim() !== '' &&
            data.department.trim() !== '' &&
            data.phoneNumber.trim() !== '' &&
            selectedRoles.length > 0 &&
            data.dob !== null &&
            data.gender.trim() != '' &&
            data.department.trim() != '' &&
            data.staffType.trim() != ''
        );
    };

    const resetForm = () => {
        setFacultyData({
            ktuId: '',
            name: { firstName: '', middleName: '', lastName: '' },
            email: '',
            password: '1234',
            phoneNumber: '',
            dob: null,
            gender: '',
            department: '',
            staffType: '',
            roles: [],
        });
        setSelectedRoles([]);
        setIsSubmitSuccess(false);
    };


    return (
        <Container>
            <HeadingTypography variant='h4'>New Faculty</HeadingTypography>

            <form
                onSubmit={handleSubmit}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <FormControl fullWidth>
                            <TextField
                                label='Ktu Id'
                                name='ktuId'
                                value={facultyData.ktuId}
                                onChange={handleInputChange}
                                required
                            />
                        </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                        <FormControl fullWidth>
                            <TextField
                                label='Name'
                                name='name'
                                value={`${facultyData.name.firstName} ${facultyData.name.middleName} ${facultyData.name.lastName}`}
                                readOnly
                                onClick={handleNameDialogOpen}
                            />
                        </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                        <FormControl fullWidth>
                            <TextField
                                label='Department'
                                name='department'
                                value={facultyData.department}
                                onChange={handleInputChange}
                                required
                            />
                        </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                        <FormControl fullWidth>
                            <TextField
                                label='Email'
                                name='email'
                                type='email'
                                value={facultyData.email}
                                onChange={handleInputChange}
                                required
                            />
                        </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                        <FormControl fullWidth>
                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                <DesktopDatePicker
                                    label='Date of Birth'
                                    inputFormat='dd/MM/yyyy'
                                    value={facultyData.dob}
                                    onChange={(date) => setFacultyData({ ...facultyData, dob: date })}
                                    renderInput={(params) => <TextField {...params} />}
                                    required
                                />
                            </LocalizationProvider>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                        <FormControl fullWidth>
                            <TextField
                                label='Phone Number'
                                name='phoneNumber'
                                type='tel'
                                value={facultyData.phoneNumber}
                                onChange={handleInputChange}
                                required
                            />
                        </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                        <FormControl fullWidth>
                            <TextField
                                label='Gender'
                                name='gender'
                                value={facultyData.gender}
                                onChange={handleInputChange}
                                required
                            />
                        </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                        <FormControl fullWidth>
                            <TextField
                                label='Staff Type'
                                name='staffType'
                                value={facultyData.staffType}
                                onChange={handleInputChange}
                                required
                            />
                        </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                        <FormControl fullWidth>
                            <TextField
                                label='Roles'
                                name='roles'
                                value={selectedRoles.join(', ')}
                                readOnly
                                onClick={handleRoleDialogOpen}
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

            {/* Role Selection Dialog */}
            <Dialog open={isRoleDialogOpen} onClose={handleRoleDialogClose} fullWidth>
                <DialogTitle>Select Roles</DialogTitle>
                <DialogContent>
                    <FormControl
                        style={{
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        {['Tutor', 'Staff Advisor', 'Head Of Dept.'].map((role) => (
                            <Button
                                key={role}
                                variant={selectedRoles.includes(role) ? 'contained' : 'outlined'}
                                color='primary'
                                onClick={() => handleRoleToggle(role)}
                                style={{ margin: '4px' }}
                            >
                                {role}
                            </Button>
                        ))}
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleRoleDialogClose} color='primary'>
                        Close
                    </Button>
                    <Button onClick={handleRoleDialogClose} color='primary'>
                        Save
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Edit Name Dialog */}
            <Dialog open={isNameDialogOpen} onClose={handleNameDialogClose} fullWidth>
                <DialogTitle>Edit Name</DialogTitle>
                <DialogContent style={{ display: 'flex', flexDirection: 'row' }}>
                    <FormControl style={{ margin: '1rem' }}>
                        <TextField
                            name='firstName'
                            label='First Name'
                            value={facultyData.name.firstName}
                            onChange={handleInputChange}
                            required
                            fullWidth
                        />
                    </FormControl>
                    <FormControl style={{ margin: '1rem' }}>
                        <TextField
                            label='Middle Name'
                            name='middleName'
                            id='middleName'
                            value={facultyData.name.middleName}
                            onChange={handleInputChange}
                            fullWidth
                        />
                    </FormControl>
                    <FormControl style={{ margin: '1rem' }}>
                        <TextField
                            label='Last Name'
                            name='lastName'
                            id='lastName'
                            value={facultyData.name.lastName}
                            onChange={handleInputChange}
                            required
                            fullWidth
                        />
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleNameDialogClose} color='primary'>
                        Close
                    </Button>
                    <Button onClick={handleNameDialogClose} color='primary'>
                        Save
                    </Button>
                </DialogActions>
            </Dialog>


            {/* Loading Dialog */}
            <Dialog open={isLoading} onClose={() => { }}>
                <DialogTitle>Loading...</DialogTitle>
                <DialogContent style={{display : 'flex', justifyContent: 'center', alignItems: 'center'}}>
                    <CircularProgress style={{justifyContent: 'center', alignItems: 'center'}}/>
                </DialogContent>
            </Dialog>

            {/* Submit Success or Error Dialog */}
            <Dialog open={isSubmitSuccess !== null} onClose={() => setIsSubmitSuccess(null)}>
                <DialogTitle>
                    {isSubmitSuccess ? 'Submission Successful' : 'Submission Failed'}
                </DialogTitle>
                <DialogContent>
                    {isSubmitSuccess ? (
                        <Typography variant="body1">Faculty data saved successfully.</Typography>
                    ) : (
                        <Typography variant="body1">Error saving faculty data.</Typography>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setIsSubmitSuccess(null)} color='primary'>
                        Close
                    </Button>
                    {isSubmitSuccess && (
                        <Button onClick={() => {setIsSubmitSuccess(null); resetForm();}} color='primary'>
                            New Entry
                        </Button>
                    )}
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default NewFaculty;
