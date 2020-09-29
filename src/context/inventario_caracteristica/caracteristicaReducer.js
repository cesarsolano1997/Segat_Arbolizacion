import { 
    OBTENER_CARACTERISTICAS,
    CREAR_CARACTERISTICA,
    MODIFICAR_CARACTERISTICA,
    ELIMINAR_CARACTERISTICA,
    MENSAJE_CARACTERISTICA
} from '../../types/index';

export default (state, action) => {
    switch(action.type){
        case OBTENER_CARACTERISTICAS:
            return {
                ...state,
                caracteristicas: action.payload
            }
        case MENSAJE_CARACTERISTICA:
            return{
                ...state,
                mensaje: action.payload
            }
        case CREAR_CARACTERISTICA:
            return {
                ...state,
                caracteristicas: [...state.caracteristicas, action.payload ]
            }
        case MODIFICAR_CARACTERISTICA:
            return {
                ...state,
                caracteristicas: state.caracteristicas.map(caracteristica => caracteristica.IdCaracteristica === action.payload.IdCaracteristica ? action.payload : caracteristica)
            }
        default:
            return state;
    }
}
