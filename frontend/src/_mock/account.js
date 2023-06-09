// ----------------------------------------------------------------------
import { useContext } from 'react';
import { DataContext } from '../DataContext';


function Account() {

  const { hellodata } = useContext(DataContext);
  const {name} = hellodata;
  const acc = {
    displayName: `${name.name.firstName} ${name.name.lastName}`,
    email: `${name.email}`,
    photoURL: '/assets/images/avatars/avatar_default.jpg',
  };

  return acc;
}


export default Account;
