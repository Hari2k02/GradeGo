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
    title: 'Courses',
    path: '/admindashboard/courses',
    icon: icon('ic_user'),
  },
  // {
  //   title: 'Timetable',
  //   path: '/admindashboard/timetable',
  //   icon: icon('ic_blog'),
  // },
  {
    title: 'Logout',
    path: '/login',
    icon: icon('ic_lock'),
  },
];

export default navConfig;
