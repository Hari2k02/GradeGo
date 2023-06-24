import React, { useState } from 'react';
import { TextField, Button, Typography, Container } from '@mui/material';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [otpNumber, setOtp] = useState('');

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handleOtpChange = (event) => {
    setOtp(event.target.value);
  };

  const handleSubmitEmail = async (event) => {
    event.preventDefault();

    // Add your password reset logic here, e.g., send a reset link to the provided email

    // Mock API call to simulate sending the email
    try {
      const response = await fetch('http://localhost:1337/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
        }),
      });

      if (response.ok) {
        console.log('OTP sent successfully');
        // Display a success message to the user
        alert('OTP sent successfully');
        setShowOtpInput(true);
      } else {
        console.log('Failed to send OTP');
        // Display an error message to the user
        alert('Failed to send OTP');
      }
    } catch (error) {
      console.log('Error occurred while sending OTP:', error);
      // Display an error message to the user
      alert('An error occurred while sending OTP');
    }
  };

  const handleSubmitOtp = async (event) => {
    event.preventDefault();

    // Add your OTP verification logic here

    // Mock API call to simulate OTP verification
    try {
      const response = await fetch('https://gradego-rtib.onrender.com/confirm-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,otpNumber,
        }),
      });

      if (response.ok) {
        console.log('OTP verification successful');
        // Display a success message to the user
        alert('OTP verification successful');
        // Clear the email and OTP input fields
        setEmail('');
        setOtp('');
        setShowOtpInput(false);
      } else {
        console.log('OTP verification failed');
        // Display an error message to the user
        alert('OTP verification failed');
      }
    } catch (error) {
      console.log('Error occurred while verifying OTP:', error);
      // Display an error message to the user
      alert('An error occurred while verifying OTP');
    }
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" align="center" gutterBottom>
        {showOtpInput ? 'Enter OTP' : 'Forgot Password'}
      </Typography>
      {!showOtpInput && (
        <Typography variant="body1" align="center" gutterBottom>
          Please enter your email address to reset your password.
        </Typography>
      )}
      <form onSubmit={showOtpInput ? handleSubmitOtp : handleSubmitEmail}>
        {!showOtpInput ? (
          <TextField
            type="email"
            label="Email"
            variant="outlined"
            fullWidth
            value={email}
            onChange={handleEmailChange}
            margin="normal"
            required
          />
        ) : (
          <TextField
            type="number"
            label="OTP"
            variant="outlined"
            fullWidth
            value={otpNumber}
            onChange={handleOtpChange}
            margin="normal"
            required
          />
        )}
        <Button type="submit" variant="contained" color="primary" fullWidth>
          {showOtpInput ? 'Verify OTP' : 'Reset Password'}
        </Button>
      </form>
    </Container>
  );
};

export default ForgotPasswordPage;
