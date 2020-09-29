import React,{ useState, useContext} from 'react';
import { makeStyles } from '@material-ui/styles';
import { 
    Card,
    CardHeader,
    CardContent,
    Divider,
    Button,
    TextField,
    FormControl
} from '@material-ui/core';
import SaveIcon from '@material-ui/icons/Save';
import { Alert } from '@material-ui/lab';
import clienteAxios from '../../../config/axios';
import tokenAuth from '../../../config/authToken';

import AlertaContext from '../../../context/alertas/alertaContext';

const useStyles = makeStyles(theme => ({
    root: {
      padding: theme.spacing(4)
    },
    margin: {
        margin: theme.spacing(1),
      },
    withoutLabel: {
        marginTop: theme.spacing(3),
    },
    textField: {
        width: '25ch',
    }
  }))

const MantenedorUsuario = ({consultarApi,usuarios}) => {

    // Definir context
    const alertaContext = useContext(AlertaContext);
    const { mostrarCargando ,mostrarAlerta } = alertaContext;

    // Usando estilos importados
    const classes = useStyles();

    const [usuario, actualizarUsuario ] = useState({
        Nombres: '',
        ApellidoMaterno: '',
        ApellidoPaterno:'',
        DNI: '',
        Password: ''
    });

    const { Nombres,ApellidoMaterno,ApellidoPaterno,DNI,Password } = usuario;

    const actualizarState = e =>{
        actualizarUsuario({
            ...usuario,
            [e.target.name] : e.target.value,
        }
        );
    }

    const [usealerta, actualizarAlerta] = useState({
        msg: '',
        response: null
    });

    const enviarUsuario = async e => {
        e.preventDefault();
        // Validar
        if(Nombres.trim() === '' || ApellidoPaterno === '' || ApellidoMaterno === '' || DNI.trim() === '' || Password === ''){
            actualizarAlerta({
                msg: "Todos los campos son obligatorios",
                response: "error"
            });  
            return;
        }

        if(String(DNI.length) < 8)
        {
            actualizarAlerta({
                msg: "El DNI debe tener 8 dígitos",
                response: "error"
            });         

            return;
        }

        const token = localStorage.getItem('token');
        tokenAuth(token);
        try {
            mostrarCargando(true);

            const respuesta = await clienteAxios.post('api/usuario/crear', usuario);   

            consultarApi() 
            mostrarAlerta(respuesta.data,"success")  

            actualizarAlerta({
                msg: '',
                response: null
            });

            actualizarUsuario({
                Nombres: '',
                ApellidoMaterno: '',
                ApellidoPaterno:'',
                DNI: '',
                Password: ''
            });

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
        <Card>
            <CardHeader 
                subheader="Formulario"
                title="Mantenimiento de usuarios"
            />
            <Divider />
            <CardContent>
                <form
                    onSubmit={enviarUsuario}
                >
                <FormControl fullWidth>
                    <TextField
                        type="text"
                        className={classes.margin}
                        variant="outlined"
                        label="Nombre"
                        name="Nombres"
                        value={Nombres}
                        onChange={actualizarState}
                    />                            
                </FormControl>
                <FormControl fullWidth>
                    <TextField
                        type="text"
                        className={classes.margin}
                        label="Apellido Paterno"
                        variant="outlined"
                        name="ApellidoPaterno"
                        value={ApellidoPaterno}
                        onChange={actualizarState}
                    />
                </FormControl>
                <FormControl fullWidth>
                    <TextField
                        type="text"
                        className={classes.margin}
                        label="Apellido Materno"
                        variant="outlined"
                        name="ApellidoMaterno"
                        value={ApellidoMaterno}                                    
                        onChange={actualizarState}
                    />
                </FormControl>
                <FormControl fullWidth>
                    <TextField
                        type="text"
                        className={classes.margin}
                        label="DNI"
                        variant="outlined"
                        name="DNI"
                        value={DNI}
                        onChange={actualizarState}
                        onInput = {(e) =>{
                            if(e.target.value.length > 0)
                            {
                                e.target.value = Math.max(0, parseInt(e.target.value) ).toString().slice(0,8)
                            }   
                            }}
                    />
                </FormControl>
                <FormControl fullWidth>
                    <TextField
                        type="text"
                        className={classes.margin}
                        label="Contraseña"
                        variant="outlined"
                        name="Password"
                        value={Password}
                        onChange={actualizarState}
                    />
                </FormControl>
                { usealerta.response === "error"
                    ? 
                        <Alert                                 
                            className={classes.margin} 
                            severity={usealerta.response}
                        >{usealerta.msg}</Alert> 
                    : 
                        null
                    }
                <FormControl fullWidth>
                    <Button
                        type="submit"
                        className={classes.margin}
                        variant="contained"
                        color="primary"
                        size="medium"
                        startIcon={<SaveIcon />}
                    >
                        Guardar
                    </Button>
                </FormControl>
                </form>
            </CardContent>
        </Card>
    );
}

export default MantenedorUsuario;


