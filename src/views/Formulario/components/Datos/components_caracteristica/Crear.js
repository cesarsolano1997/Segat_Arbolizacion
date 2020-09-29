import React,{ useState,useEffect,useContext }  from 'react'
import { makeStyles } from '@material-ui/styles';
import {
    Card,
    CardHeader,
    CardContent,
    Grid,
    Divider,
    TextField,
    FormControlLabel,
    Typography,
    Button
} from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import tokenAuth from 'config/authToken';
import clienteAxios from 'config/axios';
import InventarioContext from 'context/inventario_arboles/inventarioContext';

const useStyles = makeStyles(theme => ({
    item: {
      display: 'flex',
      flexDirection: 'column'
    },
    margin: {
      margin: theme.spacing(1),
    },
    card_margin: {
      marginTop: theme.spacing(1)
    },
    titulo:{
      margin: theme.spacing(5)
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

const Crear = ({setAgregar,mostrarAlerta,crearCaracteristica}) => {

    // Importando estilos en Componente
    const classes = useStyles();

    //const [value, setValue] = useState(null);

    // Definir context de inventario
    const inventarioContext = useContext(InventarioContext);
    const { inventario, obtenerInventario, eliminarInventario } = inventarioContext;

    // State de resolucion de pantalla
    const [resolucion, setResolucion] = useState("start")

    // State para Especies    
    const [especies, setEspecies] = useState([]);
    const [especie, setEspecie] = useState([]);

    // State para Arboles
    const [arboles, setArboles] = useState([]);
    const [arbol, setArbol] = useState([]);   

    // State de datos
    const [cantidad, setCantidad ] = useState(0)
    const [codigo, setCodigo ] = useState(0);

    useEffect(() =>{

    if(window.innerWidth <= 760) 
    {
        setResolucion("top")
    }else{
        setResolucion("start")
    }
    },[window.innerWidth])


    // UseEffect
    useEffect(() => {

    const obtenerEspecies = async () => {     
        try {
            const token = localStorage.getItem("token");
            tokenAuth(token);

            const respuesta = await clienteAxios.get('api/arbolizacion/especies');
            setEspecies(respuesta.data);

            // const index = respuesta.data.findIndex(i => i.IdEspecie === parseInt(data.IdEspecie))
            // setValue(respuesta.data[index]);

        } catch (error) {
            mostrarAlerta("Ha ocurrido un error al obtener las especies","error")
        }  
    }

    obtenerEspecies();
    
    },[]);

    useEffect(() => {  
        setArboles([])
        setArbol([])
        const ObtenerArboles = (Array) => {
        if(Array !== null && Object.keys(Array).length !== 0)
        {       
            clienteAxios.get(`api/arbolizacion/arboles/${Array.IdEspecie}`).then(
            data => setArboles(data.data)
            ).catch(
            error => (
                setArboles([]),
                mostrarAlerta("Ha ocurrido un error al obtener los arboles","error")
            )
            );   
        }
        }
        ObtenerArboles(especie);

    },[especie]);

    // Funciones

    const onSubmit = e => {
      e.preventDefault();

      if(Object.keys(especie).length === 0 && Object.keys(arbol).length === 0 && cantidad === 0 && codigo === 0)
      {
          alert("Todos los campos son obligatorios");
          return;
      }else{
          const dataApi = {
            IdInventario: inventario.IdInventario,
            IdEspecie: especie.IdEspecie,
            IdArbol: arbol.IdArbol,
            Cantidad: cantidad,
            Codigo: codigo
          }

          crearCaracteristica(dataApi);
          setAgregar(false);
      }
    }

    return(
         <Card
        md={12}
        className={classes.card_margin}
      >              
        <CardHeader
          title="Árbol"
          subheader="Características"
        />
        <Divider />
        <CardContent>
          <form
            onSubmit={onSubmit}
          >
            <Grid
              container
              spacing={6}
              wrap="wrap"                
              spacing={2}
            >
              <Grid
                className={classes.item}
                item
                md={3}
                sm={12}
                xs={12}
              >
                <FormControlLabel
                    autoComplete="off"
                    control={                    
                        <Autocomplete
                          className={classes.margin}
                          onChange={(event, newValue) => {    
                            if(newValue !== null) setEspecie(newValue); 
                            else {
                              setEspecie([]);
                            }                    
                          }}
                          options={especies}
                          getOptionLabel={(option) => option.Nombre}
                          style={{ width: "100%" }}
                          renderInput={(params) => <TextField {...params} variant="outlined" />}
                        />
                  } 
                    label={<Typography style={{ width: "20%"}}>Especies</Typography>}
                    labelPlacement={resolucion} 
                />
              </Grid>
              <Grid
                className={classes.item}
                item
                md={3}
                sm={12}
                xs={12}
              >                          
                <FormControlLabel
                    className={classes.root} 
                    control={
                      <Autocomplete
                          className={classes.margin}
                          key={ 
                            especie.length  !== null ?
                              especie.length !== 0 ? especie.IdEspecie : false
                            : false
                          }
                          onChange={(event, newValue) => {
                            if(newValue !== null) setArbol(newValue);
                            else setArbol([])
                          }}
                          getOptionLabel={(option) => (typeof option === 'string' ? option : option.Nombre)}    
                          options={arboles}
                          style={{ width: "100%"  }}
                          renderInput={(params) => <TextField {...params} variant="outlined"                          
                          />}
                      />}
                    label={<Typography style={{ width: "20%"}}>Árboles</Typography>}
                    labelPlacement={resolucion}
                  />
              </Grid>
              <Grid
                className={classes.item}
                item
                md={3}
                sm={12}
                xs={12}
              >                          
                <FormControlLabel
                    className={classes.root} 
                    autoComplete="off"
                    control={
                    <TextField 
                        variant="outlined"
                        type="number"
                        className={classes.margin}
                        style={{ width: "100%",  }}
                        onInput = {e =>{            
                          if(e.target.value.length > 0)
                          {
                            e.target.value = Math.max(0, String(e.target.value)).toString().slice(0,3)
                            
                          }
                        }}
                       onChange={e => {
                         if(e.target.value === '') setCantidad(0)
                         else setCantidad(e.target.value)}
                        }
                    />
                    }
                    label={<Typography style={{ width: "20%",}}>Cantidad</Typography>}
                    labelPlacement={resolucion}
                    style={{    display: "flex",
                    justifyContent: "space-between"}}
                  />
              </Grid>
              <Grid
                className={classes.item}
                item
                md={3}
                sm={12}
                xs={12}
              >                          
                <FormControlLabel
                    className={classes.root} 
                    autoComplete="off"
                    control={
                    <TextField 
                        variant="outlined"
                        type="text"
                        className={classes.margin}
                        style={{ width: "100%",  }}
                        onInput = {e =>{            
                          if(e.target.value.length > 0)
                          {
                            e.target.value = String(e.target.value).toString().slice(0,10)
                            
                          }
                        }}
                       onChange={e => {
                         if(e.target.value === '') setCodigo(0)
                         else setCodigo(e.target.value)}
                        }
                    />
                    }
                    label={<Typography style={{ width: "20%",}}>Código</Typography>}
                    labelPlacement={resolucion}
                    style={{    display: "flex",
                    justifyContent: "space-between"}}
                  />
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
              >Guardar</Button>            
              <Button
                variant="contained"
                size="small"
                className={classes.btn_cancelar}
                onClick={() => setAgregar(false)}
              > Cancelar
              </Button>
            </Grid>
          </form>
        </CardContent>
      </Card>
    );
}

export default Crear;
