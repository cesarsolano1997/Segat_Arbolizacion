import React,{ useState,useEffect,useContext }  from 'react'
import { makeStyles } from '@material-ui/styles';
import {
    Card,
    CardHeader,
    CardContent,
    Grid,
    Divider,
    TextField,
    Typography,
    Button
} from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { limiteInput } from 'helpers/inputHelper';
import Autocomplete from '@material-ui/lab/Autocomplete';
import ArbolesContext from 'context/arboles_datos/arbolesContext';
import CaracteristicaContext from 'context/inventario_caracteristica/caracteristicaContext';

const useStyles = makeStyles(theme => ({
    item: {
      display: 'flex',
      flexDirection: 'column'
    },
    card_margin: {
      marginTop: theme.spacing(1),
      marginBottom: theme.spacing(2)
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
    },
    pos: {
      marginBottom: 12,
    }
}));

const Crear = ({ IdInventario, setAgregar,mostrarAlerta }) => {

    // Importando estilos en Componente
    const classes = useStyles();

    // Context

    const arbolesContext = useContext(ArbolesContext);
    const { especies, arboles, obtenerEspecies, obtenerArboles } = arbolesContext;

    const caracteristicaContext = useContext(CaracteristicaContext);
    const { mensaje, crearCaracteristica } = caracteristicaContext;

    // state alerta validacion
    const [alerta, setAlerta ] = useState(false);

    // State para Especies    
    const [especie, setEspecie] = useState({});

    // State para Arboles
    const [arbol, setArbol] = useState({});   

    // State de datos
    const [datos, guardarDatos ] = useState({
      IdInventario: IdInventario,
      IdEspecie: '',
      IdArbol: '',
      Cantidad: '',
      Codigo: '',
      Observacion: '',
      Altura: '',
      Altura_Copa: '',
      Diametro: '',
      Diametro_Copa:'',
      Edad_Anio: '',
      Edad_Mes: '',
      Edad_Promedio: '',
      CAP: '',
      DAP_MAYOR:'',
      DAP_MENOR: ''
    });
    const { IdEspecie, IdArbol, Cantidad, Codigo, Observacion, Altura, Altura_Copa, Diametro,Diametro_Copa, Edad_Anio, Edad_Mes, Edad_Promedio, CAP, DAP_MAYOR, DAP_MENOR} = datos;
    
    useEffect(() => {

      obtenerEspecies();
    
    },[]);

    useEffect(() => {  

        if( Object.keys(especie).length !== 0 )
        {
          obtenerArboles(especie.IdEspecie);
        }  

    },[especie]);

    useEffect(() => {

      if(mensaje){        
        if(mensaje.estado === "error")
          mostrarAlerta(mensaje.mensaje, mensaje.estado)
        else
          setAgregar(false)
          mostrarAlerta(mensaje.mensaje, mensaje.estado)
      }

    },[mensaje]);

    // Funciones

    const handleChange = e => {
      guardarDatos({
        ...datos,
        [e.target.name] : e.target.value
      })
    }

    const onSubmit = e => {
      e.preventDefault();
      setAlerta(false);
 
      if(IdEspecie === '' || IdArbol === '' || Cantidad === '' || Codigo === '' ||  Altura === '' ||  Altura_Copa === '' || Diametro === '' || Diametro_Copa === '' ||  Edad_Anio === '' ||  Edad_Mes === '' || Edad_Promedio === '' || CAP === '' || DAP_MAYOR === '' ||  DAP_MENOR === '')
      {
        setAlerta(true);
        return;
      }
      crearCaracteristica(datos);
    }

    return(
      <Card
        md={12}
        className={classes.card_margin}
      >              
        <CardHeader
          title="Informacion del Árbol"
          subheader="Complete todos los campos"
          align="center"
          titleTypographyProps={{variant: 'h4'}}
        />
        {/* //<Divider /> */}
        <CardContent>
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
                        setEspecie(newValue);
                        guardarDatos({
                          ...datos, 
                          ["IdEspecie"] : newValue.IdEspecie
                        });
                      }
                      else {
                        setEspecie({});
                        setArbol({});
                        obtenerArboles(0);
                        guardarDatos({
                          ...datos, 
                          ["IdEspecie"] : '',
                          ["IdArbol"]: ''
                        });
                      }                    
                    }}
                    options={especies}
                    getOptionLabel={(option) => option.Nombre}
                    style={{ width: "100%" }}
                    renderInput={(params) => <TextField {...params} variant="outlined" />}
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
                        }
                      }}
                      getOptionLabel={(option) => (typeof option === 'string' ? option : option.Nombre)}    
                      options={arboles}
                      renderInput={(params) => <TextField {...params} variant="outlined"                          
                      />}
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
