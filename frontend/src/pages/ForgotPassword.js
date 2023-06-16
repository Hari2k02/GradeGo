import React, { useState } from 'react';
import { TextField, Button, Typography, Container } from '@mui/material';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Add your password reset logic here, e.g., send a reset link to the provided email

    // Mock API call to simulate sending the email
    try {
      const response = await fetch('https://gradego-rtib.onrender.com/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
        }),
      });

      if (response.ok) {
        console.log('Password reset link sent successfully');
        // Display a success message to the user
        alert('Password reset link sent successfully');
      } else {
        console.log('Failed to send password reset link');
        // Display an error message to the user
        alert('Failed to send password reset link');
      }
    } catch (error) {
      console.log('Error occurred while sending password reset link:', error);
      // Display an error message to the user
      alert('An error occurred while sending password reset link');
    }
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" align="center" gutterBottom>
        Forgot Password
      </Typography>
      <Typography variant="body1" align="center" gutterBottom>
        Please enter your email address to reset your password.
      </Typography>
      <form onSubmit={handleSubmit}>
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
        <Button type="submit" variant="contained" color="primary" fullWidth>
          Reset Password
        </Button>
      </form>
    </Container>
  );
};

export default ForgotPasswordPage;