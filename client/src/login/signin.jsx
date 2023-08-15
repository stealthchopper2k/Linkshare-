import React, { useState } from 'react';
import { Avatar } from '@mui/material';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { signInForm, googleSignIn } from './handlers';

function Copyright(props) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {'Copyright © '}
      <Link color="inherit" href="https://mui.com/">
        Linkshare
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}
export default function SignIn({ pushRoute }) {
  const [failed, setFailed] = useState(false);
  const [failedMessage, setFailedMessage] = useState('');

  async function handleForm(e) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const password = data.get('password');
    const email = data.get('email');
    try {
      const res = await signInForm(email, password);
      const message = res.message;
      if (res.success) {
        pushRoute('login');
      } else {
        setFailed(true);
        setFailedMessage(message);
        e.target.reset();
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function googleSign() {
    try {
      const res = await googleSignIn();
      const message = res.message;
      if (res.success) {
        pushRoute('login');
      } else {
        setFailed(true);
        setFailedMessage(message);
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Avatar></Avatar>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <Box
          component="form"
          onSubmit={(e) => {
            handleForm(e);
          }}
          noValidate
          sx={{ mt: 1 }}
        >
          {failed ? (
            <span className="flex justify-center items-center text-red-500">
              {failedMessage.split('/')[1]}
            </span>
          ) : (
            <span className="flex justify-center items-center text-green-500">
              {failedMessage}
            </span>
          )}
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
          />
          <FormControlLabel
            control={<Checkbox value="remember" color="primary" />}
            label="Remember me"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Sign In
          </Button>
          <Button
            onClick={() => {
              googleSign();
            }}
            style={{ backgroundColor: 'green' }}
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Google Sign In
          </Button>
          <Grid container>
            <Grid item xs>
              <Link href="/forgotpassword" variant="body2">
                Forgot password?
              </Link>
            </Grid>
            <Grid item>
              <Link href="/signup" variant="body2">
                {"Don't have an account? Sign Up"}
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
      <Copyright sx={{ mt: 8, mb: 4 }} />
    </Container>
  );
}
