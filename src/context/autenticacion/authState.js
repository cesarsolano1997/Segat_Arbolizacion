import React,{ useReducer } from 'react';
import AuthContext from './authContext';
import AuthReducer from './authReducer';

import clienteAxios from '../../config/axios';
import tokenAuth from '../../config/authToken';

import {
    LOGIN_EXITOSO,
    LOGIN_ERROR,
    OBTENER_USUARIO,
    CERRAR_SESION
} from '../../types';

const AuthState = props => {
    const initialState = {
        token: localStorage.getItem('token'),
        usuario: null,
        mensaje: null,
        autenticado: null,
        cargando: true
    }

    const [ state, dispatch] = useReducer(AuthReducer, initialState);

    // Iniciar sesion
    const inciarSession = async datos => {
        try {
            tokenAuth()
            let respuesta = await clienteAxios.post('/api/auth',datos);
            respuesta = respuesta
            dispatch({
                type: LOGIN_EXITOSO,
                payload: respuesta.data
            });
            usuarioAutenticado();
        } catch (error) {
            if(error.response !== undefined)
            {
                const alerta = {
                    msg: error.response.data.Message,
                    categoria: 'error'
                }
                
                dispatch({
                    type: LOGIN_ERROR,
                    payload: alerta
                })
            }else {
                const alerta = {
                    msg: "Error con el servidor",
                    categoria: 'error'
                }
                dispatch({
                    type: LOGIN_ERROR,
                    payload: alerta
                })
            }
        }
    }

     // Retorna el usuario autenticado
    const usuarioAutenticado = async () => {
        const token = localStorage.getItem('token');
        if(token){
            // TODO: Función para enviar el token por headers
            tokenAuth(token);
            try {
                const respuesta = await clienteAxios.get('/api/auth');
                dispatch({
                    type: OBTENER_USUARIO,
                    payload: respuesta.data
                });

            } catch (error) {
                dispatch({
                    type: LOGIN_ERROR
                })
            }
        }
    }

    // Cierrra la sesion del usuario
    const cerrrarSesion = () => {
        dispatch({
            type: CERRAR_SESION
        })
    }

    return(
        <AuthContext.Provider
            value={{
                token: state.token,
                autenticado: state.autenticado,
                usuario: state.usuario,
                mensaje: state.mensaje,
                categoria: state.mensaje,
                cargadno: state.cargando,
                inciarSession,
                usuarioAutenticado,
                cerrrarSesion
            }}
        >
            {props.children}
        </AuthContext.Provider>
    )
}

export default AuthState;