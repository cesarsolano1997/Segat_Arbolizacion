import { MOSTRAR_ALERTA, CERRAR_ALERTA,CARGANDO} from '../../types';

export default (state, action) => {
    switch(action.type){
        case MOSTRAR_ALERTA:
            return {
                alerta: action.payload
            }
        case CERRAR_ALERTA:
            return {
                alerta: null
            }
        case CARGANDO:
            return {
                cargando: action.payload
            }
        default:
            return state;
    }
}