import React,{ useReducer } from 'react';
import InventarioContext from './inventarioContext';
import InventarioReducer from './inventarioReducer';

import { 
    INVENTARIO_ARBOL,
    ELIMINAR_INVENTARIO, 
    MENSAJE_INVENTARIO, 
    LISTAR_INVENTARIO,
    AGREGAR_INVENTARIO
} from '../../types/index';

import clienteAxios from '../../config/axios';

const InventarioState = props => {
    const initialState = {
        inventarios: [],
        mensaje: null,
        inventario: null
    }

    const [ state, dispatch] = useReducer(InventarioReducer, initialState);

    const listarInventarios = async () => {
        try {
            const resultado = await clienteAxios.get('api/inventario/listar');
            dispatch({
                type: LISTAR_INVENTARIO,
                payload: resultado.data
            });
            
        } catch (error) {
            let alerta = {};
            if(error.response !== undefined)
            {  
                alerta={
                    mensaje: error.response.data.Message,
                    estado: "error"
                };
            }else{
                alerta={
                    mensaje: "Ocurrio un error al obtener los formularios",
                    estado: "error"
                };               
            }
            
            dispatch({
                type: MENSAJE_INVENTARIO,
                payload: alerta
            });
        }
    }

    const agregarInvenario = async datos => {
        try {
            const resultado = await clienteAxios.post("/api/inventario/crear",datos);
            dispatch({
                type: AGREGAR_INVENTARIO,
                payload: resultado.data
            })
            

            dispatch({
                type: MENSAJE_INVENTARIO,
                payload: ({  
                    mensaje: "Creado correctamente",
                    estado: "success"
                })
            });
        } catch (error) {
            let alerta = {};
            if(error.response !== undefined)
            {  
                alerta={
                    mensaje: error.response.data.Message,
                    estado: "error"
                };
            }else{
                alerta={
                    mensaje: "Ocurrio un error al agregar el formulario",
                    estado: "error"
                };               
            }
            
            dispatch({
                type: MENSAJE_INVENTARIO,
                payload: alerta
            });
        }
    }

    const obtenerInventario = inventario => {
        dispatch({ 
            type: INVENTARIO_ARBOL,
            payload: inventario
        });
    }

    const eliminarInventario = () => {
        dispatch({
            type: ELIMINAR_INVENTARIO
        });
    }

    return (
        <InventarioContext.Provider
            value={{
                inventarios: state.inventarios,
                inventario: state.inventario,
                mensaje: state.mensaje,
                listarInventarios,
                agregarInvenario,
                obtenerInventario,
                eliminarInventario
            }}
        >
            {props.children}
        </InventarioContext.Provider>
    )
}

export default InventarioState;
