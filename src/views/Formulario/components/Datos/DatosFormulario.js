import React,{ useState,useEffect,useContext } from 'react';
import { 
    Grid, 
    Card,
    CardHeader, 
    CardContent,
    Divider,
    Typography,
    IconButton,
    Button
} from '@material-ui/core';
import {
  Add as AddIcon,
  Refresh as RefreshIcon,
  ArrowBack as ArrowBackIcon
} from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import Editar from './components_caracteristica/Editar';
import Crear from './components_caracteristica/Crear';
import CaracteristicaContext from 'context/inventario_caracteristica/caracteristicaContext';
import AlertaContext from 'context/alertas/alertaContext';

const useStyles = makeStyles((theme) => ({
    button: {
      margin: theme.spacing(1),
      background: "#1486CC",
      "&:hover": {
          background : "#2979ff"
      }
    },
  }));

const DatosFormulario = ({datosformulario,eliminarInventario}) => {   
    const classes = useStyles();

    // Definir context de inventario
    const caracteristicaContext = useContext(CaracteristicaContext);
    const { caracteristicas,mensaje ,obtenerCaracteristicas,crearCaracteristica } = caracteristicaContext;

    const alertaContext = useContext(AlertaContext);
    const { mostrarAlerta,mostrarCargando } = alertaContext

    // State de resolucion de pantalla
    const [resolucion, setResolucion] = useState({
        width: "30%",
        height: "35%"
    })

    // state para agregar caracteristica
    const [agregar, setAgregar] = useState(false);   
    
    // state para listar caracteristicas existantes
    const [caractersiticas, listarCaracteristicas ] = useState([]);

    useEffect(() =>{

        if(window.innerWidth <= 760) 
        {
            setResolucion({
                width: "90%",
                height: "95%"
            })
        }else{
            setResolucion({
                width: "30%",
                height: "35%"
            })
        }
     },[window.innerWidth])

    useEffect(() => {
        obtenerCaracteristicas(datosformulario.IdInventario);
        
    },[]);

    useEffect(() => {
        if(mensaje) 
        {   
            mostrarAlerta(mensaje.mensaje,mensaje.estado);   
        }         
    },[mensaje])

    //Funciones    

    return (
        <React.Fragment>
            <Button
                variant="contained"
                color="primary"
                disableElevation
                size="small"
                className={classes.button}
                startIcon={<ArrowBackIcon />}
                onClick={eliminarInventario}
            >
                Regresar a lista
            </Button> 
            <Card>
                <CardHeader
                    title={datosformulario.Nombre}
                    subheader={datosformulario.FechaCrea}
                    align="center"
                    titleTypographyProps={{variant: 'h3'}}
                />
                <Divider />        
                <CardContent>
                    
                <Grid
                        container
                        spacing={3}
                    >                        
                        <Grid
                            item
                            md={4}
                            xs={12}
                        >
                            <Typography variant="button" display="block" gutterBottom> Descripcion: </Typography> {datosformulario.Descripcion} 
                        </Grid>
                        <Grid
                            item
                            md={2}
                            xs={4}
                        >
                            <Typography variant="button" display="block" gutterBottom> Zona: </Typography> {datosformulario.Zona} 
                        </Grid>
                        <Grid
                            item
                            md={2}
                            xs={8}
                        >
                            <Typography variant="button" display="block" gutterBottom> Urbanizacion: </Typography> {datosformulario.Urbanizacion} 
                        </Grid>
                        <Grid
                            item
                            md={4}
                            xs={12}
                        >
                            <Typography variant="button" display="block" gutterBottom> Parque: </Typography> {datosformulario.Parque} 
                        </Grid>
                    </Grid>                
                    <Grid
                        item
                        container
                        md={12}
                        alignItems="flex-start"
                        justify="flex-end"
                        direction="row"
                        style={{ marginTop: 10}}
                    > 
                        <Button 
                            aria-label="agregar" 
                            color="primary"
                            startIcon={<AddIcon />}
                            onClick={() => setAgregar(true)}
                            disabled={agregar}
                        >Agregar </Button>     
                    </Grid> 
                    
                    { agregar 
                        ?
                        <ReactCSSTransitionGroup 
                            transitionName="anim" 
                            transitionAppear={true} 
                            transitionAppearTimeout={5000} 
                            transitionEnter={false} 
                            transitionLeave={false}>
                                <Crear
                                    setAgregar={setAgregar}
                                    mostrarAlerta={mostrarAlerta}
                                    obtenerCaracteristicas={obtenerCaracteristicas}
                                    crearCaracteristica={crearCaracteristica}
                                />
                            </ReactCSSTransitionGroup>
                        :
                            null
                    }
                    
                    { caracteristicas.length > 0 ?

                            caracteristicas.map(item => {
                            return (  
                                <Editar
                                    key={item.IdCaracteristica}
                                    data={item}
                                    mostrarAlerta={mostrarAlerta}
                                />
                            )
                        })
                        :
                        <Grid   
                            item
                            md={12}
                            sm={12}
                            xs={12}
                            align="center"
                        >

                            <img src="/images/products/caracteristicas.jpg" width={resolucion.width} height={resolucion.height} ></img>
                        </Grid>
                    }

                </CardContent>
            </Card>
        </React.Fragment>
    )
}

export default DatosFormulario;
