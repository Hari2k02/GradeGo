/**
 * @file DashboardAppPage.js
 * @description This file contains the implementation of the DashboardAppPage component.
 * It fetches data from an API, renders various sections of the dashboard, and displays the dashboard page.
 */

import { Helmet } from 'react-helmet-async';
import React, { useEffect, useContext } from 'react';
import { useTheme } from '@mui/material/styles';
import { Grid, Container, Typography } from '@mui/material';
import { FacultyDataContext } from '../FacultyDataContext';
import { DataContext } from '../DataContext';
import {
  AppCurrentVisits,
  AppWebsiteVisits,
  AppCurrentSubject,
  AppConversionRates,
} from '../sections/@dashboard/app';

/**
 * DashboardAppPage component.
 * Renders the dashboard page.
 */
export default function DashboardAppPage() {
  const { facsemdata, setFacSemData } = useContext(FacultyDataContext);
  const { hellodata } = useContext(DataContext);
  const theme = useTheme();

  useEffect(() => {
    /**
     * Fetches data from the API.
     */
    const fetchData = async () => {
      try {
        const response = await fetch('https://gradego-rtib.onrender.com/tutor/data', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            _id: hellodata.name._id,
          }),
        });

        if (!response.ok) {
          throw new Error('Error: Fetch request failed');
        }

        const data = await response.json();
        setFacSemData(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    console.log(facsemdata);
  }, [facsemdata]);

  return (
    <>
      <Helmet>
        <title>Dashboard | GradeGo</title>
      </Helmet>

      <Container maxWidth="xl">
        <Typography variant="h4" sx={{ mb: 5 }}>
          Hi, Welcome back
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} md={6} lg={8}>
            {/* Renders the AppWebsiteVisits component */}
            <AppWebsiteVisits
              title="Performance"
              subheader="(+43%) than last year"
              chartLabels={[
                '01/01/2003',
                '02/01/2003',
                '03/01/2003',
                '04/01/2003',
                '05/01/2003',
                '06/01/2003',
                '07/01/2003',
                '08/01/2003',
                '09/01/2003',
                '10/01/2003',
                '11/01/2003',
              ]}
              chartData={[
                {
                  name: 'Team A',
                  type: 'column',
                  fill: 'solid',
                  data: [23, 11, 22, 27, 13, 22, 37, 21, 44, 22, 30],
                },
                {
                  name: 'Team B',
                  type: 'area',
                  fill: 'gradient',
                  data: [44, 55, 41, 67, 22, 43, 21, 41, 56, 27, 43],
                },
                {
                  name: 'Team C',
                  type: 'line',
                  fill: 'solid',
                  data: [30, 25, 36, 30, 45, 35, 64, 52, 59, 36, 39],
                },
              ]}
            />
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            {/* Renders the AppCurrentVisits component */}
            <AppCurrentVisits
              title="Marks Percentage"
              chartData={[
                { label: 'Lab', value: 410 },
                { label: 'Internal', value: 123 },
                { label: 'Series', value: 34 },
                { label: 'Semester', value: 323 },
              ]}
              chartColors={[
                theme.palette.primary.main,
                theme.palette.info.main,
                theme.palette.warning.main,
                theme.palette.error.main,
              ]}
            />
          </Grid>

          <Grid item xs={12} md={6} lg={8}>
            {/* Renders the AppConversionRates component */}
            <AppConversionRates
              title="Portion Coverage"
              // subheader="(+43%) than last year"
              chartData={[
                { label: 'Compiler Design', value: 430 },
                { label: 'Algorithm Analysis', value: 448 },
                { label: 'Computer Graphics', value: 470 },
                { label: 'Programming in Python', value: 540 },
                { label: 'Data Analytics', value: 580 },
                { label: 'Industrial Economics', value: 490 },
                { label: 'Comprehensive Course Work', value: 430 },
              ]}
            />
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            {/* Renders the AppCurrentSubject component */}
            <AppCurrentSubject
              title="Current Subject"
              chartLabels={['CD', 'CGIP', 'AAD', 'IEFT', 'PP', 'CCW']}
              chartData={[
                { name: 'Series 1', data: [80, 50, 30, 40, 100, 20] },
                { name: 'Series 2', data: [20, 30, 40, 80, 20, 80] },
                { name: 'Series 3', data: [44, 76, 78, 13, 43, 10] },
              ]}
              chartColors={[...Array(6)].map(() => theme.palette.text.secondary)}
            />
          </Grid>
        </Grid>
      </Container>
    </>
  );
}
