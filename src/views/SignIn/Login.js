import React,{ useState, useContext, useEffect } from 'react';
import {
  Box,
  Link,
  Checkbox,
  FormControlLabel,
  TextField,
  CssBaseline,
  Button,
  Avatar
} from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import AuthContext from '../../context/autenticacion/authContext';

const Login = (props) => {

  // context
  const authContext = useContext(AuthContext);
  const { inciarSession, autenticado, mensaje} = authContext;

  // Use effect
  useEffect(() => {
    if(autenticado) return props.history.push("/");
    // eslint-disable-next-line
  }, [autenticado])

  function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <Link color="inherit">
        Cesar Solano Diaz
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
  }

  const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  }));

  // Usando State de sesión
  const [datos, actualizardatos] = useState({
  dni: '',
  password: ''
  })

  // Variables del formulario
  const {dni,password} = datos;

  const actualizarState = e => {
  actualizardatos({
    ...datos,
    [e.target.name] : e.target.value,
  });

  actualizarError({
    dni: {
      estado : false,
      descripcion: ""
    },
    password: {
      estado : false,
      descripcion: ""
    },
  })
  }

  const classes = useStyles();

  const [error, actualizarError] = useState({
  dni: {
    estado : false,
    descripcion: ""
  },
  password: {
    estado : false,
    descripcion: ""
  },
  });

  const enviarLogin = e => {
  e.preventDefault();

  if (dni.trim() === "" && password.trim() === "")
  {
    actualizarError({
      ...error,
      dni: {estado : true, descripcion: "Complete el campo"},
      password: {estado : true, descripcion: "Complete el campo"}
    })
    return;
  }else if (dni.trim() === "")
  {
    actualizarError({
      ...error,
      dni: {estado: true , descripcion: "Complete el campo"}
    })
    return;
  }else if (dni.length !== 8 )
  {
    actualizarError({
      ...error,
      dni: {estado: true , descripcion: "Debe tener 8 dígitos"}
    })
    return;
  }else if (password.trim() === "")
  {
    actualizarError({
      ...error,
      password: {estado: true , descripcion: "Complete el campo"}
    })
    return;
  }

      inciarSession({dni,password});
  }

  return (
    <Container component="main" maxWidth="xs">
    <CssBaseline />
    <div className={classes.paper}>
      <Avatar className={classes.avatar}>
      </Avatar>
      <Typography component="h1" variant="h5">
        Inicio de Sesión
      </Typography>
      <form className={classes.form} noValidate 
            onSubmit={enviarLogin}>
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          label="DNI"
          name="dni"
          value={dni} 
          error = { error.dni.estado ? true : false}
          helperText= { error.dni.estado ? error.dni.descripcion : null}
          type="number"
          onChange = {actualizarState}
          maxLength={8}
          autoFocus
          onInput = {e =>{            
            if(e.target.value.length > 0)
            {
              e.target.value = Math.max(0, String(e.target.value) ).toString().slice(0,8)
            }
          }}
        />
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          name="password"
          value={password}
          error = { error.password.estado ? true : false}
          helperText= { error.password.estado ? error.password.descripcion : null}
          label="Contraseña"
          type="password"
          onChange = {actualizarState}
          autoComplete="current-password"
        />
        <FormControlLabel
          control={<Checkbox value="remember" color="primary" />}
          label="Recuérdame"
        />
        { mensaje 
          ? <Alert severity={mensaje.categoria}>{mensaje.msg}</Alert> 
          : null
        }
        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          className={classes.submit}
        >
          Ingresar
        </Button>
      </form>
    </div>
    <Box mt={8}>
      <Copyright />
    </Box>
  </Container>
  )

}

export default Login;
