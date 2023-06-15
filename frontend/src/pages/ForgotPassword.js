import React, { useState } from 'react';
import { TextField, Button, Typography, Container } from '@mui/material';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Add your password reset logic here, e.g., send a reset link to the provided email
    console.log(`Sending password reset link to ${email}`);
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
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
        >
          Reset Password
        </Button>
      </form>
    </Container>
  );
};

export default ForgotPasswordPage;