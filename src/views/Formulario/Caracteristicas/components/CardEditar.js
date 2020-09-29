import React, { useState, useEffect, useContext } from 'react'
import { makeStyles } from '@material-ui/core/styles';
import {
    Grid,
    Typography,
    ExpansionPanel,
    ExpansionPanelDetails,
    ExpansionPanelSummary,
    Divider,
    TextField,
    Button
} from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { Alert } from '@material-ui/lab';
import { limiteInput } from 'helpers/inputHelper';
import clienteAxios from 'config/axios';

import CaracteristicaContext from 'context/inventario_caracteristica/caracteristicaContext';

const useStyles = makeStyles((theme) => ({
    heading: {
      fontSize: theme.typography.pxToRem(15),
      fontWeight: 'bold',
      flexBasis: '33.33%',
      flexShrink: 0,
    },
    secondaryHeading: {
      fontSize: theme.typography.pxToRem(15),
      color: theme.palette.text.secondary,
    },
    btn_cancelar: {
      marginLeft: 5,
      color: "#958b8b", 
      "&:hover": { 
        background: "#efefef"
      }
    },
    btn_guardar: {
      background: "#1486CC",
      color: "#fff",
      "&:hover": {
        background: "#2979ff"
     }
    }
}));
const CardEditar = ({ IdInventario,mensaje, caracteristica, expanded, especies, handleChangePanel,mostrarAlerta }) => {
    const classes = useStyles();

    const { IdCaracteristica, Especie, Arbol } = caracteristica;

    //Context
    const caracteristicaContext = useContext(CaracteristicaContext);
    const {  editarCaracteristica } = caracteristicaContext;

    // State de datos
    const [datos, guardarDatos ] = useState({
        IdCaracteristica: IdCaracteristica,
        IdInventario: IdInventario,
        IdEspecie: caracteristica.IdEspecie,
        IdArbol: caracteristica.IdArbol,
        Cantidad: caracteristica.Cantidad,
        Codigo: caracteristica.Codigo,
        Observacion: caracteristica.Observacion,
        Altura: caracteristica.Altura,
        Altura_Copa: caracteristica.Altura_Copa,
        Diametro: caracteristica.Diametro,
        Diametro_Copa:caracteristica.Diametro_Copa,
        Edad_Anio: caracteristica.Edad_Anio,
        Edad_Mes: caracteristica.Edad_Mes,
        Edad_Promedio: caracteristica.Edad_Promedio,
        CAP: caracteristica.CAP,
        DAP_MAYOR:caracteristica.DAP_MAYOR,
        DAP_MENOR: caracteristica.DAP_MENOR
    });

    const { IdEspecie, IdArbol, Cantidad, Codigo, Observacion, Altura, Altura_Copa, Diametro,Diametro_Copa, Edad_Anio, Edad_Mes, Edad_Promedio, CAP, DAP_MAYOR, DAP_MENOR} = datos;        

    const [especie, setEspecie] = useState({
        IdEspecie: IdEspecie,
        Nombre: Especie
    });
    
    const [arboles, setArboles] = useState([]);

    const [arbol, setArbol] = useState({
        IdArbol: IdArbol,
        Nombre: Arbol
    });
    
    // state alerta validacion
    const [alerta, setAlerta ] = useState(false);

    useEffect(() => {  

        if( Object.keys(especie).length !== 0 )
        {
          obtenerArboles(especie.IdEspecie);
        }  

    },[especie]);

    useEffect(() => {
        
        if(mensaje){
            if(mensaje.estado === "success")
            {
                handleChangePanel(`panel${IdCaracteristica}`)
            }
        }
    },[mensaje])
    
    // Funcion para guardar los datos del formulario
    const handleChange = e => {
        guardarDatos({
          ...datos,
          [e.target.name] : e.target.value
        })
    }
    
    const obtenerArboles = async IdEspecie => {
        try {
            
            const resultado = await clienteAxios.get(`api/arbolizacion/arboles/${IdEspecie}`);
           
            setArboles(resultado.data)

        } catch (error) {
            mostrarAlerta("Ocurrio un error al obtener los árboles","error")
        }
    }

    const onSubmit = e => {
        e.preventDefault();

        setAlerta(false);

        if(IdEspecie === '' || IdArbol === '' || Cantidad === '' || Codigo === '' ||  Altura === '' ||  Altura_Copa === '' || Diametro === '' || Diametro_Copa === '' ||  Edad_Anio === '' ||  Edad_Mes === '' || Edad_Promedio === '' || CAP === '' || DAP_MAYOR === '' ||  DAP_MENOR === '')
        {
            setAlerta(true);
        }        
        editarCaracteristica(datos)
    }

    return(
        <ExpansionPanel 
            expanded={expanded === `panel${IdCaracteristica}`} 
            onChange={handleChangePanel(`panel${IdCaracteristica}`)}
        >
        <ExpansionPanelSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1bh-content"
            id="panel1bh-header"
        >
        <Typography className={classes.heading}>Código: {Codigo}</Typography>
        <Typography className={classes.secondaryHeading}>Especie: {Especie} &nbsp; Árbol: {Arbol} &nbsp; Cantidad: {Cantidad}</Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
        <form
            onSubmit={onSubmit}
        >
            <Grid
                container
                spacing={3}
                wrap="wrap"                
            >    
            <Grid
                item
                md={12}
                sm={12}
                xs={12}
            >                
                <Typography variant="subtitle1" gutterBottom>
                Tipo de árbol 
                </Typography>
                <Divider />
            </Grid>         
            <Grid
                className={classes.item}
                item
                md={3}
                sm={12}
                xs={12}
            >
                <Grid
                item
                md={12}
                >
                <Typography>Especies</Typography>
                </Grid>  
                <Grid
                item
                md={12}
                >
                <Autocomplete
                    onChange={(event, newValue) => { 
                    if(newValue !== null) {
                        setArbol({});
                        setEspecie(newValue);
                        guardarDatos({
                            ...datos, 
                            ["IdEspecie"] : newValue.IdEspecie
                        });
                    }
                    else {
                        setEspecie({});
                        setArbol({});
                        setArboles([])
                        obtenerArboles(0);
                        guardarDatos({
                            ...datos, 
                            ["IdEspecie"] : '',
                            ["IdArbol"]: ''
                        });
                    }                    
                    }}
                    options={especies}
                    getOptionLabel={option => option.Nombre ? option.Nombre : ''}
                    style={{ width: "100%" }}
                    renderInput={(params) => <TextField {...params} variant="outlined" />}
                    value={especie}
                />  
                </Grid>   
            </Grid>
            <Grid
                className={classes.item}
                item
                md={3}
                sm={12}
                xs={12}
            > 
                <Grid
                    item
                    md={12}
                >
                <Typography>Árboles</Typography>
                </Grid>  
                <Grid
                    item
                    md={12}
                >
                <Autocomplete
                    key={ 
                        especie.length  !== null ?
                        especie.length !== 0 ? especie.IdEspecie : false
                        : false
                    }
                    onChange={(event, newValue) => {
                        if(newValue !== null) {
                        setArbol(newValue);
                            guardarDatos({
                                ...datos, 
                                ["IdArbol"] : newValue.IdArbol
                            });
                        }
                        else {
                            setArbol({})
                            guardarDatos({
                                ...datos, 
                                ["IdArbol"] : ''
                            });
                        }
                    }}
                    options={arboles}
                    getOptionLabel={option => option.Nombre ? option.Nombre : ''}
                    renderInput={(params) => <TextField {...params} variant="outlined"/>}                    
                    value={arbol}         
                />
                </Grid>
            </Grid>
            <Grid
                className={classes.item}
                item
                md={3}
                sm={12}
                xs={12}
            >   
                <Grid
                item
                md={12}
                >
                <Typography>Cantidad</Typography>
                </Grid>     
                <Grid
                item
                md={12}
                >    
                <TextField 
                    variant="outlined"
                    type="number"
                    name="Cantidad"
                    value={Cantidad}
                    onInput = {e => (limiteInput(e,3)) }
                    onChange={handleChange}
                    fullWidth
                />
                </Grid>   
            </Grid>
            <Grid
                className={classes.item}
                item
                md={3}
                sm={12}
                xs={12}
            >                          
                <Grid
                item
                md={12}
                >
                <Typography>Código</Typography>
                </Grid>
                <Grid
                item
                md={12}
                >                
                <TextField 
                    variant="outlined"
                    type="text"
                    name="Codigo"
                    value={Codigo}
                    onInput = {e => (limiteInput(e,10)) }
                    onChange={handleChange}
                    fullWidth
                />                 
                </Grid>
            </Grid>
            <Grid
                className={classes.item}                  
                item
                md={12}
                sm={12}
                xs={12}
            >   
                <Grid
                    item
                    md={12}
                >
                    <Typography>Observación</Typography>
                </Grid>
                <Grid
                    item
                    md={12}
                >
                    <TextField
                        name="Observacion"
                        value={Observacion}
                        onChange={handleChange}
                        multiline
                        rows={4}
                        variant="outlined"
                        fullWidth
                    /> 
                </Grid>
                </Grid>
            </Grid>  
            <Grid
            container
            spacing={3}
            wrap="wrap"                
            style={{ marginTop: 30}}
            > 
            <Grid
                item
                md={12}
                sm={12}
                xs={12}
                style={{ paddingBottom: 10 }}
            >                
                <Typography variant="subtitle1" gutterBottom>
                    Párametros del árbol 
                </Typography>
            <Divider />
            </Grid>              
            <Grid
                className={classes.item}
                item
                md={3}
                sm={12}
                xs={12}
                >
                <Grid
                    item
                    md={12}
                >
                    <Typography>Altura (metros)</Typography>
                </Grid>
                <Grid
                    item
                    md={12}
                >
                    <TextField
                    type="number"
                    name="Altura"
                    value={Altura}
                    onChange={handleChange}
                    variant="outlined"
                    fullWidth
                    /> 
                </Grid>
            </Grid>
            <Grid
                className={classes.item}
                item
                md={3}
                sm={12}
                xs={12}
                >
                <Grid
                    item
                    md={12}
                >
                    <Typography>Altura de Copa (metros)</Typography>
                </Grid>
                <Grid
                    item
                    md={12}
                >
                    <TextField
                    text="number"
                    name="Altura_Copa"
                    value={Altura_Copa}
                    onChange={handleChange}
                    variant="outlined"
                    fullWidth
                    /> 
                </Grid>
            </Grid>
            <Grid
                className={classes.item}
                item
                md={3}
                sm={12}
                xs={12}
                >
                <Grid
                    item
                    md={12}
                >
                    <Typography>Diámetro (metros)</Typography>
                </Grid>
                <Grid
                    item
                    md={12}
                >
                    <TextField
                    type="number"
                    name="Diametro"
                    value={Diametro}
                    onChange={handleChange}
                    variant="outlined"
                    fullWidth
                    /> 
                </Grid>
            </Grid>
            <Grid
                className={classes.item}
                item
                md={3}
                sm={12}
                xs={12}
                >
                <Grid
                    item
                    md={12}
                >
                    <Typography>Diámetro copa (metros)</Typography>
                </Grid>
                <Grid
                    item
                    md={12}
                >
                    <TextField
                    type="number"
                    name="Diametro_Copa"
                    value={Diametro_Copa}
                    onChange={handleChange}
                    variant="outlined"
                    fullWidth
                    /> 
                </Grid>
            </Grid>
            </Grid>       
            <Grid
            container
            spacing={3}
            wrap="wrap"                
            style={{ marginTop: 30}}
            > 
            <Grid
                item
                md={4}
            >
                <Grid
                container
                spacing={3}
                >
                <Grid
                    item
                    md={12}
                    xs={12}
                >
                    <Typography variant="subtitle1" gutterBottom>Edad</Typography>
                    <Divider />
                </Grid>
                <Grid
                    item
                    md={3}
                    xs={6}
                >
                    <Grid
                    item
                    md={12}
                    xs={12}
                    >
                    <Typography>Edad (año)</Typography>
                    </Grid>
                    <Grid
                    item
                    md={12}
                    xs={12}
                    >
                    <TextField
                        type="number"
                        name="Edad_Anio"
                        value={Edad_Anio}
                        onChange={handleChange}
                        variant="outlined"
                        fullWidth
                    /> 
                    </Grid>
                </Grid>
                <Grid
                    item
                    md={3}
                    xs={6}
                >
                    <Grid
                    item
                    md={12}
                    xs={12}
                    >
                    <Typography>Edad (mes)</Typography>
                    </Grid>
                    <Grid
                    item
                    md={12}
                    xs={12}
                    >
                    <TextField
                        type="number"
                        name="Edad_Mes"
                        value={Edad_Mes}
                        onChange={handleChange}
                        variant="outlined"
                        fullWidth
                    /> 
                    </Grid>
                </Grid>
                <Grid
                    item
                    md={6}
                    xs={12}
                >
                    <Grid
                    item
                    md={12}
                    xs={12}
                    >
                    <Typography>Edad promedio</Typography>
                    </Grid>
                    <Grid
                    item
                    md={12}
                    xs={12}
                    >
                    <TextField
                        type="number"
                        name="Edad_Promedio"
                        value={Edad_Promedio}
                        onChange={handleChange}
                        variant="outlined"
                        fullWidth
                        /> 
                    </Grid>
                </Grid>
                </Grid>
            </Grid>
            <Grid
                item
                md={8}
            >
                <Grid
                container
                spacing={3}
                >
                <Grid
                    item
                    md={12}
                    xs={12}
                >
                    <Typography variant="subtitle1" gutterBottom>Otros</Typography>
                    <Divider />
                </Grid>
                <Grid
                    item
                    md={4}
                    xs={12}
                >
                    <Grid
                    item
                    md={12}
                    xs={12}
                    >
                    <Typography>CAP</Typography>
                    </Grid>
                    <Grid
                    item
                    md={12}
                    xs={12}
                    >
                    <TextField
                        type="number"
                        name="CAP"
                        value={CAP}
                        onChange={handleChange}
                        variant="outlined"
                        fullWidth
                    /> 
                    </Grid>
                </Grid>
                <Grid
                    item
                    md={4}
                    xs={12}
                >
                    <Grid
                    item
                    md={12}
                    xs={12}
                    >
                    <Typography>DAP_MAYOR</Typography>
                    </Grid>
                    <Grid
                    item
                    md={12}
                    xs={12}
                    >
                    <TextField
                        type="number"
                        name="DAP_MAYOR"
                        value={DAP_MAYOR}
                        onChange={handleChange}
                        variant="outlined"
                        fullWidth
                    /> 
                    </Grid>
                </Grid>
                <Grid
                    item
                    md={4}
                    xs={12}
                >
                    <Grid
                    item
                    md={12}
                    xs={12}
                    >
                    <Typography>DAP_MENOR</Typography>
                    </Grid>
                    <Grid
                    item
                    md={12}
                    xs={12}
                    >
                    <TextField
                        type="number"
                        name="DAP_MENOR"
                        value={DAP_MENOR}
                        onChange={handleChange}
                        variant="outlined"
                        fullWidth
                    /> 
                    </Grid>
                </Grid>
                </Grid>
            </Grid>
            </Grid>
            <Grid
            container
            spacing={3}
            >
            <Grid
                item
                md={12}
            >
                
                {alerta 
                ?
                    <Alert severity="error"> Todos los campos son obligatorios</Alert>
                :
                    null
                } 
            </Grid>
            </Grid>            
            <Grid
            item
            container
            md={12}
            alignItems="flex-start"
            justify="flex-end"
            direction="row"
            style={{ marginTop: 10}}
            >                
            <Button  
                type="submit"
                size="small"
                className={classes.btn_guardar}
                variant="contained"
            >Guardar cambios</Button>            
            <Button
                variant="contained"
                size="small"
                className={classes.btn_cancelar}
                onClick={handleChangePanel(`panel${IdCaracteristica}`)}
            > Cancelar
            </Button>
            </Grid>
        </form>
        </ExpansionPanelDetails>
    </ExpansionPanel>

    )

}

export default CardEditar;