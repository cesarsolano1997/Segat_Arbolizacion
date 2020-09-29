import React,{ useReducer } from 'react';
import ArbolesContext from './arbolesContext';
import ArbolesReducer from './arbolesReducer';
import clienteAxios from '../../config/axios';

import { 
    OBTENER_ESPECIES,
    OBTENER_ARBOLES,
    MENSAJE_ESTADO
} from '../../types/index';

const ArbolesState = props => {

    const InitialState = {
        especies: [],
        arboles: [],
        mensaje: null
    }

    const [ state, dispatch] = useReducer(ArbolesReducer, InitialState);

    const obtenerEspecies = async () => {
        
        try {

            const resultado = await clienteAxios.get('api/arbolizacion/especies');

            dispatch({
                type: OBTENER_ESPECIES,
                payload: resultado.data
            });
            

        } catch (error) {
            obtenerError(error);
        }
    }

    const obtenerArboles = async IdEspecie => {
        try {
            
            const resultado = await clienteAxios.get(`api/arbolizacion/arboles/${IdEspecie}`);
           
            dispatch({
                type: OBTENER_ARBOLES,
                payload: resultado.data
            });


        } catch (error) {
            dispatch({
                type: OBTENER_ARBOLES,
                payload: []
            });
            obtenerError(error);
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
            type: MENSAJE_ESTADO,
            payload: alerta
        });
    }

    return(
        <ArbolesContext.Provider
            value={{
                especies: state.especies,
                arboles: state.arboles,
                obtenerEspecies,
                obtenerArboles
            }}
        >
            {props.children}
        </ArbolesContext.Provider>
    )
}

export default ArbolesState;