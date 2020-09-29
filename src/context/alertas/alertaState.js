import React,{ useReducer } from 'react';
import AlertaContext from './alertaContext';
import AlertaReducer from './alertaReducer';

import {
    MOSTRAR_ALERTA,
    CERRAR_ALERTA,
    CARGANDO
} from '../../types';

const AlertaState = props => {
    const initialState = {
        alerta: null,
        cargando: false
    }

    const [ state, dispatch] = useReducer(AlertaReducer, initialState);

    // Funciones
    const mostrarAlerta = (msg, response) => {
   
        dispatch({ 
            type: MOSTRAR_ALERTA,
            payload: {
                msg,
                response
            }
        });
      
        setTimeout(() => {
            console.log("alerta")
            dispatch({
                type: CERRAR_ALERTA
            })
        }, 5000);
    }

    const mostrarCargando = (estado) => {
        dispatch({
            type: CARGANDO,
            payload: estado
        })
    }

    return (
        <AlertaContext.Provider
            value={{
                alerta: state.alerta,
                cargando: state.cargando,
                mostrarAlerta,
                mostrarCargando
            }}
        >
            {props.children}
        </AlertaContext.Provider>
    );
} 

export default AlertaState;