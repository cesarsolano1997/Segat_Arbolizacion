import React,{ useState, useEffect, useContext } from 'react';
import {
    Paper,
    Grid,
    Card,
    CardHeader,
    CardContent,
    Divider,
    Typography,
    Button
} from '@material-ui/core';
import {
    Add as AddIcon,
    ArrowBack as ArrowBackIcon
  } from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'

import Crear from './components/Crear';
import Editar from './components/Editar';

import CaracteristicaState from 'context/inventario_caracteristica/caracteristicaState';
import DatosArbolesState from 'context/arboles_datos/arbolesState';
import AlertaContext from 'context/alertas/alertaContext';

const useStyles = makeStyles((theme) => ({
    button: {
      margin: theme.spacing(1),
      background: "#1486CC",
      "&:hover": {
          background : "#2979ff"
      }
    },
    root: {
        padding: theme.spacing(3)
    },
  }));

const Datos = ({ history }) => {

    // Estilos
    const classes = useStyles();    

    // Context
    const alertaContext = useContext(AlertaContext);
    const { mostrarAlerta, mostrarCargando } = alertaContext;  

    // State de inventario
    const [ inventario, guardarInventario ] = useState({});
    const { IdInventario ,Nombre, Descripcion, FechaCrea , Zona, Urbanizacion, Parque  } = inventario;

    // State para agregar caracteristica
    const [ agregar, setAgregar ] = useState(false);

    const [ carga, setCarga ] = useState(false);

    useEffect(() => {
        setCarga(false)
        const datos = JSON.parse(localStorage.getItem('inventario'));

        if(datos){
            guardarInventario(datos);
        }else{
            history.push("/formulario")
        }
        setCarga(true)
    }, [])

    

    return (
        <div className={classes.root}>
            <Button
                variant="contained"
                color="primary"
                disableElevation
                size="small"
                className={classes.button}
                startIcon={<ArrowBackIcon />}
                onClick={() => history.push('/formulario')}
            >
                Regresar a lista
            </Button>
            <Paper >
                <Card>
                    <CardHeader
                        title={Nombre}
                        subheader={FechaCrea}
                        align="center"
                        titleTypographyProps={{variant: 'h2'}}
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
                                <Typography variant="button" display="block" gutterBottom> Descripcion: </Typography> {Descripcion}
                            </Grid>
                            <Grid
                                item
                                md={2}
                                xs={4}
                            >
                                <Typography variant="button" display="block" gutterBottom> Zona: </Typography> {Zona}
                            </Grid>
                            <Grid
                                item
                                md={2}
                                xs={8}
                            >
                                <Typography variant="button" display="block" gutterBottom> Urbanizacion: </Typography> {Urbanizacion}
                            </Grid>
                            <Grid
                                item
                                md={4}
                                xs={12}
                            >
                                <Typography variant="button" display="block" gutterBottom> Parque: </Typography> {Parque}
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
                        <CaracteristicaState>
                                    <DatosArbolesState>
                        { agregar
                           ?
                           
                                <ReactCSSTransitionGroup
                                    transitionName="anim"
                                    transitionAppear={true}
                                    transitionAppearTimeout={5000}
                                    transitionEnter={false}
                                    transitionLeave={false}
                                >
                                    
                                    <Crear
                                        IdInventario={IdInventario}
                                        setAgregar={setAgregar}
                                        mostrarAlerta={mostrarAlerta}
                                    />
                                </ReactCSSTransitionGroup>
                                
                            :
                                null
                        }                           
                        
                        { carga ?
                                <Editar 
                                    IdInventario={IdInventario} 
                                    mostrarAlerta={mostrarAlerta}
                                />
                            :
                                null                             
                        }

                        </DatosArbolesState>
                        </CaracteristicaState>   
                    </CardContent>
                </Card>
            </Paper>
        </div>
    )
}

export default Datos;

