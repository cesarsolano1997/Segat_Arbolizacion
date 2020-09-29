import { 
    OBTENER_ESPECIES,
    OBTENER_ARBOLES
} from '../../types/index';

export default (state, action) => {
    switch(action.type){
        case OBTENER_ESPECIES:
            return {
                ...state,
                especies: action.payload
            }
        case OBTENER_ARBOLES:
            return {
                ...state,
                arboles: action.payload
            }
        default:
            return state;
    }
}