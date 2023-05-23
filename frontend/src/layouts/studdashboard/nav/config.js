import React from 'react';
import SvgColor from '../../../components/svg-color';

const icon = (name) => <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />;

const navConfig = [
  {
    title: 'dashboard',
    path: '/studdashboard/app',
    icon: icon('ic_analytics'),
  },
  {
    title: 'user',
    path: '/studdashboard/attendance',
    icon: icon('ic_user'),
  },
  {
    title: 'Timetable',
    path: '/studdashboard/timetable',
    icon: icon('ic_blog'),
  },
  {
    title: 'login',
    path: '/login',
    icon: icon('ic_lock'),
  },
];

export default navConfig;
