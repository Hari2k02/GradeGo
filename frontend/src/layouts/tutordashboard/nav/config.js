import React from 'react';
import SvgColor from '../../../components/svg-color';

const icon = (name) => <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />;

const navConfig = [
  {
    title: 'dashboard',
    path: '/dashboard/app',
    icon: icon('ic_analytics'),
  },
  {
    title: 'Attendance Setting',
    path: '/dashboard/attendance-setting',
    icon: icon('ic_user'),
  },
  {
    title: 'Attendance Report',
    path: '/dashboard/attendance-report',
    icon: icon('ic_user'),
  },
  {
    title: 'Timetable',
    path: '/dashboard/timetable',
    icon: icon('ic_blog'),
  },
  {
    title: 'Logout',
    path: '/login',
    icon: icon('ic_lock'),
  },
];

export default navConfig;
