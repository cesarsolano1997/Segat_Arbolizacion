import React,{ useEffect, useState, useContext } from 'react'
import { makeStyles, useTheme  } from '@material-ui/core/styles';
import { 
    Card,
    CardHeader,
    Divider,
    CardContent,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    TablePagination,
    TableFooter,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Button
 } from '@material-ui/core'; 
 import IconButton from '@material-ui/core/IconButton';
 import {
     Delete as DeleteIcon,
     Edit as EditIcon
    } from '@material-ui/icons';
import {
    FirstPage as FirstPageIcon,
    KeyboardArrowLeft,
    KeyboardArrowRight,
    LastPage as LastPageIcon
}from '@material-ui/icons';

import clienteAxios from '../../../config/axios';
import tokenAuth from '../../../config/authToken';

import AlertaContext from '../../../context/alertas/alertaContext';

const useStyles = makeStyles((theme) => ({
    root: {
        overflowX: 'auto',
    },
    marginIcon: {
        margin: theme.spacing(1),
    },
    EditIcon : {
        "&:hover" : {
            color: "#FFBB33"     
        }
    },
    DeleteIcon : {
        "&:hover" : {
            color: "#FF3333"
        }
    },
    TableResponsive: {
        flexShrink: 0,
        marginLeft: theme.spacing(2.5),
    }
}));

const useStyles1 = makeStyles((theme) => ({
    root: {
      flexShrink: 0,
      marginLeft: theme.spacing(2.5)
    },
  }));

function TablePaginationActions(props) {
    const classes = useStyles1();
    const theme = useTheme();
    const { count, page, rowsPerPage, onChangePage } = props;
  
    const handleFirstPageButtonClick = (event) => {
      onChangePage(event, 0);
    };
  
    const handleBackButtonClick = (event) => {
      onChangePage(event, page - 1);
    };
  
    const handleNextButtonClick = (event) => {
      onChangePage(event, page + 1);
    };
  
    const handleLastPageButtonClick = (event) => {
      onChangePage(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
    };
  
    return (
      <div className={classes.root}>
        <IconButton
          onClick={handleFirstPageButtonClick}
          disabled={page === 0}
          aria-label="Primera página"
        >
          {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
        </IconButton>
        <IconButton onClick={handleBackButtonClick} disabled={page === 0} aria-label="Página anterior">
          {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
        </IconButton>
        <IconButton
          onClick={handleNextButtonClick}
          disabled={page >= Math.ceil(count / rowsPerPage) - 1}
          aria-label="Siguiente página"
        >
          {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
        </IconButton>
        <IconButton
          onClick={handleLastPageButtonClick}
          disabled={page >= Math.ceil(count / rowsPerPage) - 1}
          aria-label="Última página"
        >
          {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
        </IconButton>
      </div>
    );
  }


const ListarUsuarios = ({consultarApi,usuarios}) => {

    // Definir context
    const alertaContext = useContext(AlertaContext);
    const { mostrarAlerta, mostrarCargando } = alertaContext;

    const classes = useStyles();

    useEffect(() => {        
        consultarApi();
        // eslint-disable-next-line
    }, []);

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);  
  
    const handleChangePage = (event, newPage) => {
      setPage(newPage);
    };
  
    const handleChangeRowsPerPage = (event) => {
      setRowsPerPage(parseInt(event.target.value, 10));
      setPage(0);
    };

    // Configuracion del modal
    
    const [open, setOpen] = useState(false);
    
    const [ datos, guardarDatos ] = useState({});
    
    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
      setOpen(false);
    }
    const handleEliminar = async () => {
      const token = localStorage.getItem('token');
      tokenAuth(token);
      try {        
          mostrarCargando(true);

          let resultado = await clienteAxios.delete(`/api/usuario/eliminar/${datos.DNI}`) 

          consultarApi()
          setOpen(false);          
          mostrarAlerta(resultado.data,"success");  
      }
       catch (error) {
         setOpen(false);
         mostrarAlerta(error.response.data.Message,"error")  
      }   

      mostrarCargando(false);   
    };
    
    return (
        <Card>
                <CardHeader 
                    title="Listado de usuarios"
                />
                <Divider />
                <CardContent>
                    <Paper className={classes.root}>                                       
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell align="center">DNI</TableCell>
                                <TableCell align="center">Nombres</TableCell>
                                <TableCell align="center">Apellido Paterno</TableCell>
                                <TableCell align="center">Apellido Materno</TableCell>
                                <TableCell align="center">Opciones</TableCell>
                            </TableRow>                            
                        </TableHead>
                        <TableBody>
                            {(rowsPerPage > 0
                                ? usuarios.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                : usuarios
                              ).map(usuario => (
                                <TableRow key={usuario.DNI} className={classes.Table}>
                                    <TableCell align="center">{usuario.DNI}</TableCell>
                                    <TableCell align="center">{usuario.Nombres}</TableCell>
                                    <TableCell align="center">{usuario.ApellidoPaterno}</TableCell>
                                    <TableCell align="center">{usuario.ApellidoMaterno}</TableCell>
                                    <TableCell align="center">
                                        <IconButton aria-label="editar">
                                            <EditIcon className={classes.EditIcon}/>
                                        </IconButton>
                                        <IconButton aria-label="eliminar" onClick={() => {
                                              guardarDatos(usuario) 
                                              handleClickOpen()
                                            }}>
                                            <DeleteIcon className={classes.DeleteIcon}/>                                            
                                        </IconButton>   
                                    </TableCell>
                                </TableRow>                                    
                            ))} 
                        </TableBody>
                        <TableFooter>
                            <TableRow>
                            <TablePagination
                                rowsPerPageOptions={[5, 10, 25, { label: 'Todos', value: -1 }]}
                                colSpan={3}
                                count={usuarios.length}
                                rowsPerPage={rowsPerPage}
                                page={page}
                                SelectProps={{
                                    inputProps: { 'aria-label': 'Filas por página' },
                                    native: true,
                                }}
                                onChangePage={handleChangePage}
                                onChangeRowsPerPage={handleChangeRowsPerPage}
                                ActionsComponent={TablePaginationActions}
                                rowSpan={2}
                            />
                            </TableRow>
                        </TableFooter>
                    </Table>
                    </Paper>    
                </CardContent>
                <Dialog
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="responsive-dialog-title"
                >
                    <DialogTitle id="responsive-dialog-title">{`¿Dese eliminar al usuario ${datos.Nombres} ${datos.ApellidoPaterno} ${datos.ApellidoMaterno}?`}</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Si usted inhabilita este usuario, este ya no podrá acceder al sistema.
                        </DialogContentText>               
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose} color="primary">
                            Cancelar
                        </Button>
                        <Button onClick={handleEliminar} color="secondary" style={{color: "#DC004E"}}>
                            Eliminar
                        </Button>
                    </DialogActions>
                </Dialog>
        </Card>
    )
}

export default ListarUsuarios;
