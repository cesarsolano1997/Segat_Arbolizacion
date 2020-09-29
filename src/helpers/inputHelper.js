export function limiteInput(e, cantidad){            
    if(e.target.value.length > 0)
    {
       return e.target.value = e.target.value.toString().slice(0,cantidad);
    }
}