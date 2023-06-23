import React, { createContext, useState, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';

export const DataContext = createContext();

const { localStorage } = window;

function DataProvider ({ children })  {
  const [hellodata, setHelloData] = useState(() => {
    const storedData = localStorage.getItem('hellodata');
    return storedData
      ? JSON.parse(storedData)
      : {
          status: '',
          user: '',
          isAdvisor: '',
          name: {},
          details: {},
          course: [],
          accessToken: '',
          refreshToken: '',
        };
  });

  useEffect(() => {
    localStorage.setItem('hellodata', JSON.stringify(hellodata));
  }, [hellodata]);

  //   useEffect(() => {
  //   const storedData = localStorage.getItem('hellodata');
  //   if (!storedData) {
  //     setHelloData({
  //       status: '',
  //       user: '',
  //       isAdvisor: '',
  //       name: {},
  //       details: {},
  //       course: [],
  //       accessToken: '',
  //       refreshToken: '',
  //     });
  //   }
  // }, []);

  return (
    <DataContext.Provider value={useMemo(() => ({ hellodata, setHelloData }), [hellodata, setHelloData])}>
      {children}
    </DataContext.Provider>
  );
}

DataProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export {DataProvider};
