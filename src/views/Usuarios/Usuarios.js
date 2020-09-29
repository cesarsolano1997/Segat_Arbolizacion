import React,{ useState, useContext } from 'react';
import ListarUsuarios from './components/ListarUsuarios';
import MantenedorUsuario from './components/MantenedorUsuario';
import { makeStyles } from '@material-ui/styles';

import {
    Grid
} from '@material-ui/core';
import clienteAxios from '../../config/axios';
import tokenAuth from '../../config/authToken';

import AlertaContext from '../../context/alertas/alertaContext';

const useStyles = makeStyles(theme => ({
    root: {
      padding: theme.spacing(4)
    }
}));

const Usuarios = (params) => {

    // Definir context    
    const alertaContext = useContext(AlertaContext);
    const { mostrarAlerta, mostrarCargando } = alertaContext;

    // Usando estilos importados
    const classes = useStyles();    

    const [usuarios, guardarUsuarios ] = useState([]);

    const consultarApi = async () => {

        const token = localStorage.getItem('token');
        tokenAuth(token);

        mostrarCargando(true);
        try {
            const resultado = await clienteAxios.get('/api/usuario/listar');
            guardarUsuarios(resultado.data);
            
        } catch (error) {
            if(error.response !== undefined)
            {  
                mostrarAlerta(error.response.data.Message,"error")
            }else{
                mostrarAlerta("Error de conexion","error")
            }
        }
        mostrarCargando(false);
    }

    return (
        <div className={classes.root}>
            <Grid
                container
                spacing={4}
            >
                <Grid
                    item
                    md={4}
                    xs={12}
                > 
                    <MantenedorUsuario 
                        consultarApi={consultarApi}
                        usuarios={usuarios}
                    />
                </Grid>
                <Grid
                    item
                    md={8}
                    xs={12}
                > 
                    <ListarUsuarios 
                        consultarApi={consultarApi}
                        usuarios={usuarios}
                    />
                </Grid>
            </Grid>
        </div>        
    )
}

export default Usuarios;
