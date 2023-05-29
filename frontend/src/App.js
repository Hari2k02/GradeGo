import React from 'react';
import { HashRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import {DataProvider} from './DataContext';
import {FacultyDataProvider} from './FacultyDataContext';
import Router from './routes';
import ThemeProvider from './theme';
import { StyledChart } from './components/chart';
import ScrollToTop from './components/scroll-to-top';

// ----------------------------------------------------------------------

export default function App() {
  return (
    <DataProvider>
    <FacultyDataProvider>
    <HelmetProvider>
      <HashRouter>
        <ThemeProvider>
          <ScrollToTop />
          <StyledChart />
          <Router />
        </ThemeProvider>
      </HashRouter>
    </HelmetProvider>
    </FacultyDataProvider>
    </DataProvider>
  );
}
