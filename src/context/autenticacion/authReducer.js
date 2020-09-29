import {
    LOGIN_EXITOSO,
    LOGIN_ERROR,
    OBTENER_USUARIO,
    CERRAR_SESION
} from '../../types/index';

export default (state, action) => {
    switch(action.type){
        case LOGIN_EXITOSO:  
        
            localStorage.setItem('token', action.payload)
            return {
                ...state,
                mensaje : null,
                autenticado: true,
                token : localStorage.getItem('token'),
                cargando: false
            }
        case OBTENER_USUARIO:
            return {
                ...state,
                autenticado: true,
                usuario: action.payload,
                cargando: false
            }
        case LOGIN_ERROR:
            localStorage.clear();
            return {
                ...state,
                autenticado: false,
                usuario: null,
                mensaje: action.payload,
                cargando: false
            }
        case CERRAR_SESION:
            localStorage.clear();
            return {
                ...state,
                token: null,
                usuario: null,
                autenticado: null,
                cargando: true
            }
        default:
            return state;
    }
}