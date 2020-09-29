import React,{ useState,useEffect, useContext } from 'react'
import CardEditar from './CardEditar';
import { makeStyles } from '@material-ui/core/styles'
import CaracteristicaContext from 'context/inventario_caracteristica/caracteristicaContext';
import ArbolesContext from 'context/arboles_datos/arbolesContext';

const useStyles = makeStyles((theme) => ({
    heading: {
      fontSize: theme.typography.pxToRem(15),
      fontWeight: 'bold',
      flexBasis: '33.33%',
      flexShrink: 0,
    },
    secondaryHeading: {
      fontSize: theme.typography.pxToRem(15),
      color: theme.palette.text.secondary,
    },
}));

const Editar = ({ IdInventario, mostrarAlerta }) => {
    const classes = useStyles();
    
    // Context

    const caracteristicaContext = useContext(CaracteristicaContext);
    const { caracteristicas, mensaje, obtenerCaracteristicas } = caracteristicaContext;       
    
    // Context

    const arbolesContext = useContext(ArbolesContext);
    const { especies, arboles, obtenerEspecies, obtenerArboles } = arbolesContext;
    
    // States
    const [expanded, setExpanded] = useState(false);

    useEffect(() => {
        obtenerCaracteristicas(IdInventario);
        obtenerEspecies();
    }, [])

    useEffect(() => {
        if(mensaje)
        mostrarAlerta(mensaje.mensaje,mensaje.estado)
    }, [mensaje])  


    // Funcion para cambiar el despliegue del panel
    const handleChangePanel = (panel) => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false);
    };

    return(
        <React.Fragment>   
            
            <div 
                className={classes.root} 
            >         
            {caracteristicas.length !== 0 ?
                    caracteristicas.map(caracteristica => {
                        return(
                            <CardEditar 
                                key={caracteristica.IdCaracteristica}
                                IdInventario={IdInventario}
                                caracteristica={caracteristica}
                                expanded={expanded}
                                especies={especies}   
                                mensaje = {mensaje}                        
                                handleChangePanel={handleChangePanel}
                                mostrarAlerta={mostrarAlerta}
                                
                            />)
                       
                    })
            : 
                // <img src="/images/products/caracteristicas.jpg"></img>
                null
                
            }
            </div>
        </React.Fragment>
    );
}

export default Editar;
