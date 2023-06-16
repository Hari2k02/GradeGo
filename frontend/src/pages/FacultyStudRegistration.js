import React, { useState } from 'react';
import { Button, Container, Grid, Typography } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { styled } from '@mui/system';
import * as XLSX from 'xlsx';

const StyledContainer = styled(Container)(({ theme }) => ({
  marginTop: theme.spacing(4),
}));

const StyledTitle = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(2),
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

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);
    setError('');
  };

  const handleSubmit = async () => {
    if (file && file.name.endsWith('.xlsx')) {
      try {
        const workbook = await readFile(file);
        const jsonData = convertToJson(workbook);

        console.log(jsonData);
        // Send jsonData to the backend
        console.log('Data uploaded:', jsonData);
      } catch (error) {
        setError('Error occurred while processing the file. Please try again.');
      }
    } else {
      setError('File format not supported. Please select an Excel file (.xlsx).');
    }
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
      const groupedData = {
        name: {
          firstName: row.firstName || '',
          middleName: row.middleName || '',
          lastName: row.lastName || '',
        },
        scholarshipDetails: {
          nameOfScholarship: row.nameOfScholarship || '',
          startDate: row.startDate || '',
          endDate: row.endDate || '',
          scholarshipProvider: row.scholarshipProvider || '',
          remarks: row.remarks || '',
        },
      };
  
      const additionalData = {};
  
      for (let j = 0; j < headers.length; j++) {
        const header = headers[j];
        if (
          header !== 'firstName' &&
          header !== 'middleName' &&
          header !== 'lastName' &&
          header !== 'nameOfScholarship' &&
          header !== 'startDate' &&
          header !== 'endDate' &&
          header !== 'scholarshipProvider' &&
          header !== 'remarks'
        ) {
          additionalData[header] = row[header] || '';
        }
      }
  
      const rowData = {
        ...groupedData,
        ...additionalData,
      };
  
      jsonData.push(rowData);
    }
  
    return jsonData;
  };
  

  return (
    <StyledContainer>
      <Grid container direction="column" alignItems="center" spacing={2}>
        <Grid item>
          <StyledTitle variant="h4" component="h1" gutterBottom>
            Student Data Upload
          </StyledTitle>
        </Grid>
        <Grid item>
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
        {file && (
          <Grid item>
            <Typography variant="subtitle1">
              File selected: {file.name}
            </Typography>
            <Button variant="contained" color="primary" onClick={handleSubmit}>
              Submit
            </Button>
          </Grid>
        )}
        {error && (
          <Grid item>
            <StyledErrorMessage variant="body1">{error}</StyledErrorMessage>
          </Grid>
        )}
      </Grid>
    </StyledContainer>
  );
};

export default App;