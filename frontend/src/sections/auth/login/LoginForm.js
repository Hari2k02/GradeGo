import React from 'react';
import { useState,useContext,useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {DataContext} from '../../../DataContext';
// @mui
import { Link, Stack, IconButton, InputAdornment, TextField } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import Iconify from '../../../components/iconify';


// ----------------------------------------------------------------------

export default function LoginForm() {
  const { hellodata, setHelloData } = useContext(DataContext);
  const [ktuId, setUsername] = useState("");
  const [password, setPassword] = useState("");
    useEffect(() => {
    // Clear the hellodata in local storage when the component mounts
    localStorage.removeItem('hellodata');
    localStorage.removeItem('facsemdata');
    // setHelloData({ accessToken: '', course: [], details: null, status: '', user: '' });
  }, []);
  let data={};
  const validateUser = async (event) => {
    event.preventDefault();
    const response = await fetch("https://gradego-rtib.onrender.com/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ktuId,
        password,
      }),
    });

    data = await response.json();
    setHelloData(data);
    if (data.status === 'ok') {
      console.log(hellodata);
      if (data.user === 'student' ) {
        navigate('/studdashboard', { replace: true });
      } else if (data.user === 'faculty') {
        navigate('/dashboard', { replace: true });
      } else if(data.user === 'admin') {
        navigate('/admindashboard',{ replace : true });
      }
    }
    if(data.status!='ok') {
      alert("Incorrect username or password");
    }
  }
  const navigate = useNavigate();


  

  const [showPassword, setShowPassword] = useState(false);

  // const handleClick = () => {
  //   navigate('/dashboard', { replace: true });
  // };
  
  
  return (
    <>
      <Stack spacing={3}>
        <TextField value={ktuId} name="email" onChange={(e) => setUsername(e.target.value)} label="Username" />

        <TextField
          name="password"
          value={password}
          label="Password"
          onChange={(e) => setPassword(e.target.value)}
          type={showPassword ? 'text' : 'password'}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                  <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Stack>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ my: 2 }}>
        <Link variant="subtitle2" underline="hover">
          Forgot password?
        </Link>
      </Stack>
      <LoadingButton fullWidth size="large" type="submit" variant="contained" onClick={validateUser}>
        Login
      </LoadingButton>
    </>
  );
  
}
