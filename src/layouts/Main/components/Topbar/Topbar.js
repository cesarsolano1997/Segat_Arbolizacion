import React, { useState, useContext, useEffect} from 'react';
import { Link as RouterLink } from 'react-router-dom';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import { 
  AppBar, 
  Toolbar, 
  Badge, 
  Hidden, 
  IconButton,
  Snackbar,
  Box,
  Backdrop,
  CircularProgress 
} from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import NotificationsIcon from '@material-ui/icons/NotificationsOutlined';
import InputIcon from '@material-ui/icons/Input';
import { Alert } from '@material-ui/lab';

import AuthContext from '../../../../context/autenticacion/authContext';
import AlertaContext from '../../../../context/alertas/alertaContext';

const useStyles = makeStyles(theme => ({
  root: {
    boxShadow: 'none'
  },
  flexGrow: {
    flexGrow: 1
  },
  signOutButton: {
    marginLeft: theme.spacing(1)
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  }
}));


const Topbar = props => {  

  // Definir context
  const authContext = useContext(AuthContext);
  const { cerrrarSesion } = authContext;

  const alertaContext = useContext(AlertaContext);
  const { cargando,alerta, mostrarAlerta } = alertaContext;
   
  // Definir state y styles
  const { className, onSidebarOpen, ...rest } = props;

  const classes = useStyles();

  const [notifications] = useState([]);
  
  useEffect(() => {
    if(alerta)
     { 
       setState({ open: true, ...{ vertical: 'bottom', horizontal: 'right' } });    
    }else{
      setState({ ...state, open: false });
    }

    if(cargando){
      setOpen(true)
    }else{
      setOpen(false)
    }
    // eslint-disable-next-line
  }, [alerta,cargando])

  const [state, setState] = React.useState({
    open: false,
    vertical: 'top',
    horizontal: 'center',
  });

  const [openLoading, setOpen] = React.useState(false);

  const { vertical, horizontal, open } = state;

  // const handleClick = (newState) => () => {
  //   setState({ open: true, ...newState });
  // };

  const handleClose = () => {
    setState({ ...state, open: false });
  };

  return (
    <AppBar
      {...rest}
      className={clsx(classes.root, className)}
    >
      <Toolbar>
        <RouterLink to="/">
          <img
            alt="Logo"
            src="/images/logos/logo_segat.png"
            width="133" 
            height="60"
          />
        </RouterLink>
        <div className={classes.flexGrow} />
        <Hidden mdDown>
          <IconButton color="inherit" onClick={() => mostrarAlerta("Funcionoooo","success")}>
            <Badge
              badgeContent={notifications.length}
              color="primary"
              variant="dot"
            >
              <NotificationsIcon />
            </Badge>
          </IconButton>
          <IconButton
            className={classes.signOutButton}
            color="inherit"
            onClick={() => cerrrarSesion()}
          >
            <InputIcon />
          </IconButton>
        </Hidden>
        <Hidden lgUp>
          <IconButton
            color="inherit"
            onClick={onSidebarOpen}
          >
            <MenuIcon />
          </IconButton>
        </Hidden>
      </Toolbar>     
      {
        alerta ?           
        (
          <div>            
          <Snackbar  
            anchorOrigin={{ vertical, horizontal }}
            key={`${vertical},${horizontal}`}
            open={open}
            onClose={handleClose}>
              <Alert  variant="filled" severity={alerta.response}>
              <Box fontSize="h6.fontSize">{alerta.msg}</Box>
              </Alert>
          </Snackbar>
          </div>)
        : null
      }  
      {
        cargando ?          
        <Backdrop className={classes.backdrop} open={openLoading} onClick={handleClose}>
          <CircularProgress color="inherit" />
        </Backdrop>
        : null
      }       
             
    </AppBar>
  );
};

Topbar.propTypes = {
  className: PropTypes.string,
  onSidebarOpen: PropTypes.func
};

export default Topbar;
