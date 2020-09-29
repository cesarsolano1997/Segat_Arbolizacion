import React,{ useContext } from 'react'
import { makeStyles } from '@material-ui/styles';
import { 
    Paper
} from '@material-ui/core';
import ListarFormularios from './components/ListaFormulario/ListarFormularios';

import AlertaContext from '../../context/alertas/alertaContext';
import InventarioState from '../../context/inventario_arboles/inventarioState';

const useStyles = makeStyles(theme => ({
    root: {
      padding: theme.spacing(3)
    },
    titulo:{
      margin: theme.spacing(5),
      marginBottom: theme.spacing(0)
    }
 }))

const Formulario = ({history}) => {   

    // Usando estilos importados
    const classes = useStyles();

    // Definir context de alerta
    const alertaContext = useContext(AlertaContext);
    const { mostrarAlerta, mostrarCargando } = alertaContext;  
        
    //Funciones

    return (
        <div className={classes.root}>
            <Paper>
                <InventarioState>                         
                    <ListarFormularios
                        history={history}
                        mostrarAlerta={mostrarAlerta}
                        mostrarCargando={mostrarCargando}
                    />
                </InventarioState>
            </Paper>
        </div>
    )
}


export default Formulario;