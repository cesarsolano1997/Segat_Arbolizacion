import React,{ useReducer } from 'react';
import CaracteristicaContext from './caracteristicaContext';
import CaracteristicaReducer from './caracteristicaReducer';

import { 
    OBTENER_CARACTERISTICAS,
    CREAR_CARACTERISTICA,
    MODIFICAR_CARACTERISTICA,
    ELIMINAR_CARACTERISTICA,
    MENSAJE_CARACTERISTICA,    
    OBTENER_ESPECIES,
    OBTENER_ARBOLES
} from '../../types/index';

import clienteAxios from '../../config/axios';

const CaracteristicaState = props => {
    const initialState = {
        caracteristicas: [],
        caracteristica: {},
        mensaje: null
    }

    const [ state, dispatch] = useReducer(CaracteristicaReducer, initialState);

    const obtenerCaracteristicas = async IdInventario => {
        try {
           const resultado = await clienteAxios.get(`api/caracteristica/listar/${IdInventario}`);
           dispatch({
               type: OBTENER_CARACTERISTICAS,
               payload: resultado.data
           });

        } catch (error) {
      
            obtenerError(error)
        }     
    }   

    const crearCaracteristica = async datos => {
        try {
            const resultado = await clienteAxios.post("api/caracteristica/crear", datos);
        
            dispatch({
                type: CREAR_CARACTERISTICA,
                payload: resultado.data
            });
           
            dispatch({
                type: MENSAJE_CARACTERISTICA,
                payload: {
                    mensaje: "Creado correctamente",
                    estado: "success"
                }
            });
     
        } catch (error) {
            obtenerError(error)
        }
    }

    const editarCaracteristica = async caracteristica => {
        try {
            const resultado = await clienteAxios.put("api/caracteristica/editar", caracteristica);
        
            dispatch({
                type: MODIFICAR_CARACTERISTICA,
                payload: caracteristica
            });

            dispatch({
                type: MENSAJE_CARACTERISTICA,
                payload: {
                    mensaje: "Editado correctamente",
                    estado: "success"
                }
            });
        } catch (error) {
            obtenerError(error)
        }
    }
        
    const obtenerError = error => {
            
        let alerta = {};
        if(error.response !== undefined)
        {  
            alerta= {
                mensaje: error.response.data.Message,
                estado: "error"
            };
        }else{
            alerta = {
                mensaje: "Ocurrio un error al obtener las caracteristicas",
                estado: "error"
            };               
        }
        
        dispatch({
            type: MENSAJE_CARACTERISTICA,
            payload: alerta
        });
    }
    
    return(
        <CaracteristicaContext.Provider
            value={{
                caracteristicas: state.caracteristicas,
                mensaje: state.mensaje,
                obtenerCaracteristicas,
                crearCaracteristica,
                editarCaracteristica
            }}
        >
            {props.children}
        </CaracteristicaContext.Provider>
            
    )
}

export default CaracteristicaState;