import { 
    INVENTARIO_ARBOL,
    AGREGAR_INVENTARIO,
    ELIMINAR_INVENTARIO,
    LISTAR_INVENTARIO, 
    MENSAJE_INVENTARIO
} from '../../types/index';

export default (state, action) => {
    switch(action.type){
        case LISTAR_INVENTARIO:
            return{
                ...state,
                inventarios: action.payload
            }
        case AGREGAR_INVENTARIO:
            return {
                ...state,
                inventarios: [action.payload,...state.inventarios ]
            }
        case INVENTARIO_ARBOL :
            localStorage.setItem('inventario', JSON.stringify(action.payload))
            return {
                ...state,
                inventario : action.payload
            }
        case ELIMINAR_INVENTARIO:
            localStorage.setItem("inventario",null)
            return{
                ...state,
                inventario: null
            }
        case MENSAJE_INVENTARIO:
            return{
                ...state,
                mensaje: action.payload
            }
        default:
            return state;
    }
}