/*
  Component: StudDashboardAppPage
  Description: This component represents the dashboard page for the student app.
*/

import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useTheme } from '@mui/material/styles';
import { Grid, Container, Typography } from '@mui/material';
import {
  AppCurrentVisits,
  AppWebsiteVisits,
  AppCurrentSubject,
  AppConversionRates,
} from '../sections/@dashboard/app';

export default function StudDashboardAppPage() {
  const theme = useTheme();
    const navigate = useNavigate();
    useEffect(() => {
    const storedData = localStorage.getItem('hellodata');
    if(!storedData)
    {
        navigate('/login', { replace: true });
    }
  }, [])
  return (
    <>
      {/* Set the document title */}
      <Helmet>
        <title>Dashboard | GradeGo</title>
      </Helmet>

      <Container maxWidth="xl">
        <Typography variant="h4" sx={{ mb: 5 }}>
          Hi, Welcome back
        </Typography>

        <Grid container spacing={3}>
          {/* <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary title="Weekly Sales" total={714000} icon={'ant-design:android-filled'} />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary title="New Users" total={1352831} color="info" icon={'ant-design:apple-filled'} />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary title="Item Orders" total={1723315} color="warning" icon={'ant-design:windows-filled'} />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary title="Bug Reports" total={234} color="error" icon={'ant-design:bug-filled'} />
          </Grid> */}

          {/* AppWebsiteVisits section */}
          <Grid item xs={12} md={6} lg={8}>
            <AppWebsiteVisits
              title="Student Performance"
              // subheader="(+43%) than last year"
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

          {/* AppCurrentVisits section */}
          <Grid item xs={12} md={6} lg={4}>
            <AppCurrentVisits
              title="Marks Percentage"
              chartData={[
                { label: 'Lab', value: 4344 },
                { label: 'Internal', value: 5435 },
                { label: 'Series', value: 1443 },
                { label: 'Semester', value: 4443 },
              ]}
              chartColors={[
                theme.palette.primary.main,
                theme.palette.info.main,
                theme.palette.warning.main,
                theme.palette.error.main,
              ]}
            />
          </Grid>

          {/* AppConversionRates section */}
          <Grid item xs={12} md={6} lg={8}>
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

          {/* AppCurrentSubject section */}
          <Grid item xs={12} md={6} lg={4}>
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
