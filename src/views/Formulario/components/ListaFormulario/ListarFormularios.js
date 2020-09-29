import React,{ useState ,useEffect,useContext } from 'react'
import { makeStyles } from '@material-ui/core/styles';
import { 
    Grid,
    Typography,
    Card,
    Button,
    CardHeader,
    Divider,
    CardContent,
    IconButton,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle
} from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import {
    Delete as DeleteIcon,
    Edit as EditIcon,
    Add as AddIcon,
    Refresh as RefreshIcon
} from '@material-ui/icons';


import CrearFormulario from './CrearFormulario';
import DatosFormulario from '../Datos/DatosFormulario';

import InventarioContext from '../../../../context/inventario_arboles/inventarioContext';

const useStyles = makeStyles({
    media: {
      height: 140,
    },
    title: {
        fontSize: 14,
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
    marginAction: {
        marginLeft: 18,
        marginRight: 18,
        marginBottom:12
    },
    paddingAction: {
        paddingTop: 0
    },
    marginContent: {
        marginBottom: 0
    },
    paddingContent:{
        paddingBottom: 0
    },
    card_margin: {
        marginBottom: 10
    }
  });

const ListarFormularios = ({ history, mostrarAlerta, mostrarCargando }) => {

    // Estilos
    const classes = useStyles();      

    // Definir context de inventario
    const inventarioContext = useContext(InventarioContext);
    const { inventarios,inventario, mensaje, obtenerInventario, eliminarInventario,listarInventarios,agregarInvenario } = inventarioContext;

    // state para los formularios
    const [formularios, setFormularios] = useState([]);

    const [open, setOpen] = useState(false);    

    // State de datos del modal
    const [datos, setDatos] = useState({
        descripcion: '',
        IdArea: '',
        IdParque: ''
      });

    // State de validacion del formulario
    const [mensajeForm, setMensaje] = useState(null);
    
    useEffect(() => {   
        
        listarInventarios(); 

        const obtenerDatos = () =>{
            
            mostrarCargando(true);
 
            if(localStorage.getItem("inventario") !== undefined )
                if(localStorage.getItem("inventario") !== 'null')
                    obtenerInventario(JSON.parse(localStorage.getItem("inventario")))   

            setTimeout(() => {            
                mostrarCargando(false);
            }, 1000);
        }
                  
        obtenerDatos();

    },[])

    useEffect(() => {
        
        if(mensaje)
        {  
            console.log("Desde listar formularios")
            mostrarAlerta(mensaje.mensaje, mensaje.estado)
        }
      
    },[mensaje])    

    //Funciones
    const handleClickOpen = () => {
        setOpen(true);
        setMensaje(null);
    };

    const handleClose = () => {

        limpiarModal();
        setOpen(false);   
    };

    const enviarFormulario = e => {
        e.preventDefault();

        if(datos.descripcion === '' || datos.IdArea === '' || datos.IdParque === '')
        {
            setMensaje({
                msg:"Todos los campos son obligatorios",
                categoria: "error"
            });
            return;
        }
        agregarInvenario(datos);
        setOpen(false);
      }

    const limpiarModal = () =>{
        setDatos({
            descripcion: '',
            IdArea: '',
            IdParque: ''
        })
    }

    return (         
        <React.Fragment>
                <Grid
                    md={12}
                    sm={12}
                    xs={12}
                    item
                >            
                    <Card>
                        <CardHeader
                            title="Listado de formularios"
                            align="center"
                            titleTypographyProps={{variant: 'h3'}}
                        >                   
                        </CardHeader>
                        <Divider />
                        <CardContent>
                        <Grid
                            item
                            container
                            md={12}
                            alignItems="flex-start"
                            justify="flex-end"
                            direction="row"
                            style={{marginBottom:5}}
                        >                     
                            <Button 
                                aria-label="refrescar" 
                                startIcon={<RefreshIcon />}
                                onClick={listarInventarios}
                            >     Actualizar</Button> 
                            <Button 
                                aria-label="agregar" 
                                color="primary" 
                                onClick={handleClickOpen}
                                startIcon={<AddIcon />}
                            >   Agregar</Button>     
                        </Grid> 
                        { Object.keys(inventarios).length !== 0 
                            ?
                                inventarios.map(item =>{
                                    return (
                                        <Card
                                            className={classes.card_margin}
                                            key={item.IdInventario}
                                        >
                                        <CardContent>
                                            <Typography className={classes.title} color="textSecondary" gutterBottom>
                                                Creado el {item.FechaCrea}
                                            </Typography>
                                            <Grid
                                                container 
                                                spacing={2}
                                            >   
                                                <Grid 
                                                    md={2}
                                                    sm={12}
                                                    xs={12}
                                                    item
                                                >
                                                    <Typography>{item.Nombre}</Typography>
                                                </Grid>
                                                <Grid 
                                                    md={4}  
                                                    sm={12}                                          
                                                    xs={12}
                                                    item
                                                >
                                                    <Typography>{item.Descripcion}</Typography>
                                                </Grid>
                                                <Grid 
                                                    md={2} 
                                                    sm={6}                                           
                                                    xs={12}
                                                    item
                                                >
                                                    <Typography>{item.Zona} - {item.Urbanizacion}</Typography>
                                                </Grid>
                                                <Grid 
                                                    md={2}    
                                                    sm={6}                                        
                                                    xs={12}
                                                    item
                                                >
                                                    <Typography>{item.Parque}</Typography>
                                                </Grid>
                                                <Grid 
                                                    md={2}
                                                    sm={12}
                                                    xs={12}
                                                    item
                                                >
                                                    <IconButton 
                                                        aria-label="editar"
                                                        className={classes.IconButton} 
                                                        onClick={() => {obtenerInventario(item);history.push('/formulario/caracteristica')}} 
                                                    >
                                                        <EditIcon className={classes.EditIcon} />
                                                    </IconButton>
                                                    <IconButton 
                                                        aria-label="eliminar" 
                                                        className={classes.IconButton}
                                                    >
                                                        <DeleteIcon className={classes.DeleteIcon}/>
                                                    </IconButton>
                                                </Grid>
                                            </Grid>
                                        </CardContent>
                                    </Card>
                                    )
                                })
                            
                            :
                            null
                        }
                        
                        </CardContent>
                    </Card>           
                    
                    <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
                        <DialogTitle id="form-dialog-title">Nuevo formulario de arbolización</DialogTitle>            
                        <form
                        onSubmit={enviarFormulario}
                        > 
                            <DialogContent
                                className={classes.marginContent, classes.paddingContent}
                            >
                                <DialogContentText>
                                    Complete los siguientes campos para poder crear la hoja del formulario.
                                </DialogContentText>
                                <CrearFormulario 
                                    datos={datos}
                                    setDatos={setDatos}
                                />
                            </DialogContent>
                            <DialogActions
                                className={classes.paddingAction,classes.marginAction}
                            >
                            <Grid
                            container                        
                            >           
                                <Grid 
                                    item
                                    md={12}
                                    sm={12} 
                                    xs={12}
                                >
                                                
                                    { mensajeForm 
                                        ? <Alert severity={mensajeForm.categoria}>{mensajeForm.msg}</Alert> 
                                        : null
                                    }
                                </Grid>  
                                <Grid 
                                    item
                                    container
                                    md={12}  
                                    sm={12}  
                                    xs={12}                        
                                    alignItems="flex-start"
                                    justify="flex-end"
                                    direction="row"
                                >                              
                                    <Button onClick={handleClose} color="default">
                                        Cancel
                                    </Button>
                                    <Button color="primary" type="submit">
                                        Enviar
                                    </Button>  
                                </Grid> 
                            </Grid>
                            </DialogActions>
                        </form>
                    </Dialog>
                </Grid>
        </React.Fragment>
    )
}

export default ListarFormularios;
