import React, { useContext } from 'react';
import { DataContext } from './DataContext';
import { Navigate, useRoutes } from 'react-router-dom';
import DashboardLayout from './layouts/dashboard';
import StudDashboardLayout from './layouts/studdashboard';
import TutorDashboardLayout from './layouts/tutordashboard';
import SimpleLayout from './layouts/simple';
import AttendanceSetting from './pages/AttendanceSetting';
import LoginPage from './pages/LoginPage';
import Page404 from './pages/Page404';
import DashboardAppPage from './pages/DashboardAppPage';
import TutorDashboardAppPage from './pages/TutorDashboardAppPage';
import TimeTable from './pages/TimeTable';
import StudDashboardAppPage from './pages/StudDashboardAppPage';
import StudAttendance from './pages/StudAttendance';
import AttendanceReport from './pages/AttendanceReport';
import StudTimeTable from './pages/StudTimeTable';
import AdminDashboardAppPage from './pages/AdminDashboardAppPage';
import AdminDashboardLayout from './layouts/admindashboard';
import AdminCourses from './pages/AdminCourses';
import NewFaculty from './pages/AdminNewFaculty';
import NewCourse from './pages/AdminNewCourse';
import Home from './pages/home';
import Contact from './pages/contact';
import RoleSelection from './pages/RoleSelection'
import ForgotPassword from './pages/ForgotPassword';
import FacultyStudRegistration from './pages/FacultyStudRegistration';
import TutorAttendanceReport from './pages/TutorAttendanceReport';

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
      path: '/roleselection',
      element: isAuthenticated ? <RoleSelection/> : <Navigate to ="/login" replace/>
    },
    {
      path: '/dashboard',
      element: isAuthenticated ? <DashboardLayout /> : <Navigate to="/login" replace />,
      children: [
        { element: <Navigate to="/dashboard/app" replace />, index: true },
        { path: 'app', element: <DashboardAppPage /> },
        { path: 'attendance-report', element: <AttendanceReport /> },
        { path: 'timetable', element: <TimeTable /> },
        { path: 'student-registration',element: <FacultyStudRegistration />},
      ],
    },
    
    {
      path: '/tutordashboard',
      element: isAuthenticated ? <TutorDashboardLayout /> : <Navigate to="/login" replace />,
      children: [
        { element: <Navigate to="/tutordashboard/app" replace />, index: true },
        { path: 'app', element: <TutorDashboardAppPage /> },
        { path: 'attendance-report', element: <TutorAttendanceReport /> },
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
        { path: 'new-faculty', element:<NewFaculty />},
        { path: 'new-course', element:<NewCourse />}
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