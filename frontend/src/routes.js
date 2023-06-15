import React, { useContext } from 'react';
import { DataContext } from './DataContext';
import { Navigate, useRoutes } from 'react-router-dom';
import DashboardLayout from './layouts/dashboard';
import StudDashboardLayout from './layouts/studdashboard';
import SimpleLayout from './layouts/simple';
import AttendanceSetting from './pages/AttendanceSetting';
import LoginPage from './pages/LoginPage';
import Page404 from './pages/Page404';
import DashboardAppPage from './pages/DashboardAppPage';
import TimeTable from './pages/TimeTable';
import StudDashboardAppPage from './pages/StudDashboardAppPage';
import StudAttendance from './pages/StudAttendance';
import AttendanceReport from './pages/AttendanceReport';
import StudTimeTable from './pages/StudTimeTable';
import AdminDashboardAppPage from './pages/AdminDashboardAppPage';
import AdminDashboardLayout from './layouts/admindashboard';
import AdminCourses from './pages/AdminCourses';
import Home from './pages/home';
import Contact from './pages/contact';
import ForgotPassword from './pages/ForgotPassword'; // Import the ForgotPassword component

export default function Router() {
  const { hellodata } = useContext(DataContext);

  const isAuthenticated = hellodata.accessToken !== '';

  const routes = useRoutes([
    {
      path: '/',
      element: <Home />,
      children: [{ element: <Navigate to="/" replace />, index: true }],
    },
    {
      path: '/dashboard',
      element: isAuthenticated ? <DashboardLayout /> : <Navigate to="/login" replace />,
      children: [
        { element: <Navigate to="/dashboard/app" replace />, index: true },
        { path: 'app', element: <DashboardAppPage /> },
        { path: 'attendance-report', element: <AttendanceReport /> },
        { path: 'attendance-setting', element: <AttendanceSetting /> },
        { path: 'timetable', element: <TimeTable /> },
      ],
    },
    {
      path: '/studdashboard',
      element: isAuthenticated ? <StudDashboardLayout /> : <Navigate to="/login" replace />,
      children: [
        { element: <Navigate to="/studdashboard/app" replace />, index: true },
        { path: 'app', element: <StudDashboardAppPage /> },
        { path: 'attendance', element: <StudAttendance /> },
        { path: 'timetable', element: <StudTimeTable /> },
      ],
    },
    {
      path: '/admindashboard',
      element: isAuthenticated ? <AdminDashboardLayout /> : <Navigate to="/login" replace />,
      children: [
        { element: <Navigate to="/admindashboard/app" replace />, index: true },
        { path: 'app', element: <AdminDashboardAppPage /> },
        { path: 'courses', element: <AdminCourses /> },
        // { path: 'timetable', element:<AdminTimeTable />}
      ],
    },
    {
      path: '/login',
      element: <LoginPage />,
    },
    {
      path: '/forgot-password', // New route for ForgotPassword page
      element: <ForgotPassword />,
    },
    {
      path: '/contact',
      element: <Contact />,
    },
    {
      element: <SimpleLayout />,
      children: [
        { element: <Navigate to="/login" />, index: true },
        { path: '404', element: <Page404 /> },
        { path: '*', element: <Navigate to="/404" /> },
      ],
    },
    {
      path: '*',
      element: <Navigate to="/404" replace />,
    },
  ]);

  return routes;
}