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
          details: {},
          course: {},
          accessToken: '',
        };
  });

  useEffect(() => {
    localStorage.setItem('hellodata', JSON.stringify(hellodata));
  }, [hellodata]);

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
