import React from 'react';
import SvgColor from '../../../components/svg-color';

const icon = (name) => <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />;

const navConfig = [
  {
    title: 'dashboard',
    path: '/admindashboard/app',
    icon: icon('ic_analytics'),
  },
  {
    title: 'Course Assignment',
    path: '/admindashboard/courses',
    icon: icon('ic_user'),
  },
  {
    title: 'New Faculty',
    path: '/admindashboard/new-faculty',
    icon: icon('ic_user'),
  },
  {
    title: 'New Course', 
    path: '/admindashboard/new-course', 
    icon: icon('ic_analytics'),
  },
  {
    title: 'Logout',
    path: '/login',
    icon: icon('ic_lock'),
  },
];

export default navConfig;
