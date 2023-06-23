import React, { useEffect, useState } from 'react';
import { Button, Container, Grid, Typography } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { styled } from '@mui/system';
import * as XLSX from 'xlsx';
import { useNavigate } from 'react-router-dom';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

const StyledContainer = styled(Container)(({ theme }) => ({
  marginTop: theme.spacing(4),
}));

const StyledTitle = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  textAlign: 'left',
}));

const StyledInput = styled('input')({
  display: 'none',
});

const StyledErrorMessage = styled(Typography)(({ theme }) => ({
  color: theme.palette.error.main,
  marginTop: theme.spacing(2),
}));

const App = () => {
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [isFileUploaded, setIsFileUploaded] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const navigate = useNavigate();
  useEffect(() => {
    const storedData = localStorage.getItem('hellodata');
    if (!storedData) {
      navigate('/login', { replace: true });
    }
  }, []);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);
    setIsFileUploaded(true); // Set the flag to indicate file upload
    setError('');
  };

  const handleSubmit = async () => {
    if (file && file.name.endsWith('.xlsx')) {
      try {
        setIsUploading(true);
        const workbook = await readFile(file);
        const jsonData = convertToJson(workbook);

        console.log(jsonData);
        // Send jsonData to the backend
        sendDataToBackend(jsonData);
        setIsSubmitted(true);
      } catch (error) {
        setError('Error occurred while processing the file. Please try again.');
      } finally {
        setIsUploading(false);
      }
    } else {
      setError('File format not supported. Please select an Excel file (.xlsx).');
    }
  };

  const sendDataToBackend = (jsonData) => {
    // Make a POST request to the backend endpoint with the jsonData in the request body
    fetch('http://localhost:1337/facdashboard/studentRegistration', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ jsonData }), // Wrap jsonData in an object
    })
      .then((response) => {
        if (response.ok) {
          return response.json(); // Parse the response body as JSON
        } else {
          throw new Error('Error occurred while sending data to the backend.');
        }
      })
      .then((data) => {
        console.log('Data uploaded:', data); // Log the response data
      })
      .catch((error) => {
        console.error(error);
        setError('Error occurred while sending data to the backend.');
      });
  };

  const readFile = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const data = new Uint8Array(event.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        resolve(workbook);
      };
      reader.onerror = () => {
        reject(new Error('Error occurred while reading the file.'));
      };
      reader.readAsArrayBuffer(file);
    });
  };

  const convertToJson = (workbook) => {
    const jsonData = [];
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const headers = XLSX.utils.sheet_to_json(worksheet, { header: 1 })[0];
    const rows = XLSX.utils.sheet_to_json(worksheet);

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const name = {
        firstName: String(row.firstName || ''),
        middleName: String(row.middleName || ''),
        lastName: String(row.lastName || ''),
      };

      const scholarshipDetails = {
        nameOfScholarship: String(row.nameOfScholarship || ''),
        startDate: String(row.startDate || ''),
        endDate: String(row.endDate || ''),
        scholarshipProvider: String(row.scholarshipProvider || ''),
        remarks: String(row.remarks || ''),
      };

      const additionalData = {};

      for (let j = 0; j < headers.length; j++) {
        const header = headers[j];
        if (header === 'dob') {
          additionalData[header] = row[header] ? new Date(row[header]) : null;
        } else if (
          header !== 'firstName' &&
          header !== 'middleName' &&
          header !== 'lastName' &&
          header !== 'nameOfScholarship' &&
          header !== 'startDate' &&
          header !== 'endDate' &&
          header !== 'scholarshipProvider' &&
          header !== 'remarks'
        ) {
          additionalData[header] = String(row[header] || '');
        }
      }

      const rowData = {
        name,
        scholarshipDetails,
        ...additionalData,
      };

      jsonData.push(rowData);
    }

    return jsonData;
  };

  return (
    <StyledContainer>
      <Grid container direction="column" alignItems="center" spacing={2}>
        <Grid item xs={12}>
          <StyledTitle variant="h4" component="h1" align="left">
            Student Data Upload
          </StyledTitle>
        </Grid>
        <Grid item xs={12}>
          <label htmlFor="file-input">
            <StyledInput
              type="file"
              accept=".xlsx, .xls"
              onChange={handleFileChange}
              id="file-input"
            />
            <Button
              variant="contained"
              color="primary"
              component="span"
              startIcon={<CloudUploadIcon />}
            >
              Upload Excel File
            </Button>
          </label>
        </Grid>
        {file && isFileUploaded && (
          <Grid item xs={12}>
            <Typography variant="subtitle1" align="center">
              File selected: {file.name}
            </Typography>
          </Grid>
        )}
        {error && (
          <Grid item xs={12}>
            <StyledErrorMessage variant="body1">{error}</StyledErrorMessage>
          </Grid>
        )}
        {isFileUploaded && (
          <Grid item xs={12} style={{ marginTop: 'auto' }}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmit}
              disabled={isUploading}
            >
              {isUploading ? 'Uploading...' : 'Submit'}
            </Button>
          </Grid>
        )}
        <TransitionGroup>
          {isSubmitted && (
            <CSSTransition classNames="message" timeout={300}>
              <Grid item xs={12}>
                <Typography
                  variant="subtitle1"
                  align="center"
                  style={{ color: 'green' }}
                >
                  Data submitted successfully!
                </Typography>
              </Grid>
            </CSSTransition>
          )}
        </TransitionGroup>
      </Grid>
      <style>
        {`
          .message-enter {
            opacity: 0;
            transform: translateY(-20px);
          }
          .message-enter-active {
            opacity: 1;
            transform: translateY(0);
            transition: opacity 300ms, transform 300ms;
          }
          .message-exit {
            opacity: 1;
          }
          .message-exit-active {
            opacity: 0;
            transition: opacity 300ms;
          }
        `}
      </style>
    </StyledContainer>
  );
};

export default App;