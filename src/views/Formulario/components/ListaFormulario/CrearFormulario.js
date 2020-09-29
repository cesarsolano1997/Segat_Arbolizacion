import React,{ useState ,useEffect, useContext, Fragment } from 'react'
import { makeStyles } from '@material-ui/styles';
import {
  Card,
  CardHeader,
  CardContent,
  Grid,
  Divider,
  TextField,
  FormControlLabel,
  Typography 
} from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';

import clienteAxios from '../../../../config/axios';
import tokenAuth from '../../../../config/authToken';
import { limiteInput } from '../../../../helpers/inputHelper';
import axios from 'axios'

const useStyles = makeStyles(theme => ({
    item: {
      display: 'flex',
      flexDirection: 'column'
    },
    margin: {
      margin: theme.spacing(1),
    },
    card_margin: {
      margin: theme.spacing(0),
      marginBottom: theme.spacing(2)
    }
  }));

const CrearFormulario = ({mostrarAlerta,datos,setDatos}) => {

    // Importando estilos en Componente
    const classes = useStyles();

    // State de resolucion de pantalla
    const [resolucion, setResolucion] = useState({labelPlacement:"start",width: "80%"})

    // State para Zonas
    const [zonas, setZonas] = useState([]);
    const [zona, setZona] = useState([]);

    // State para Urbanizacion
    const [urbanizaciones, setUrbanizaciones] = useState([]);
    const [urbanizacion, setUrbanizacion] = useState([]);

    //State para Áreas
    const [areas, setAreas] = useState([]);
    const [area, setArea] = useState([]);

    //State para Parques
    const [parques, setParques] = useState([]);
    const [parque, setParque] = useState([]);

    // 
    const {descripcion, IdArea, IdParque} = datos;

    useEffect(() =>{

      if(window.innerWidth <= 760) 
      {
        setResolucion({labelPlacement:"top",width: "100%"})
      }else{
        setResolucion({labelPlacement:"start",width: "80%"})
      }
    },[window.innerWidth])

    // UseEffect
    useEffect(() => {

        const token = localStorage.getItem("token");
        tokenAuth(token);
        if(token)
        {
          const responseZona = clienteAxios.get('api/ubicacion/zona');
          const responseArea = clienteAxios.get('api/ubicacion/area')

          axios.all([responseZona, responseArea ]).then(axios.spread((...responses) => {
            setZonas(responses[0].data);
            setAreas(responses[1].data)
          })
          ).catch(errors => {
            if (errors[0]) mostrarAlerta("Ha ocurrido un error al obtener las zonas","error")
            else mostrarAlerta("Ha ocurrido un error al obtener las áreas","error")            
          })
        }

    }, [])
    
    useEffect(() => {
        setUrbanizaciones([]);
        setUrbanizacion([]);
        const ObtenerUrbanizacion = Array => {
          if(Array !== null && Object.keys(Array).length !== 0)
          {
            clienteAxios.get(`api/ubicacion/urbanizacion/${Array.IdZona}`).then(
              data => setUrbanizaciones(data.data)
            ).catch(
              error => (
                mostrarAlerta("Ha ocurrido un error al obtener las urbanizaciones","error"),
                setUrbanizaciones([])
              )
            );
          }
        }
        ObtenerUrbanizacion(zona);

    }, [zona]);

    useEffect(() => {
      const ObtenerParques = () => {
        if(Object.keys(area).length !== 0 && Object.keys(urbanizacion).length !== 0)
        {
          clienteAxios.get(`api/ubicacion/parque/${urbanizacion.IdUrbanizacion}/${area.IdArea}`).then(
            data => setParques(data.data)
          ).catch(
            error => (
              mostrarAlerta("Ha ocurrido un error al obtener los parques","error")
            )
          );
        }
      }
      ObtenerParques()
    }, [urbanizacion, area])

    // Funciones

    return(
      <Fragment >
        <Card
          className={classes.card_margin}
        >
          <CardHeader 
            title={"Datos"}
          />
          <Divider />
          <CardContent>
          <Grid
                container
                spacing={6}
                wrap="wrap"                
                spacing={2}
              >
            <Grid
              className={classes.item}
              item
              md={12}
              sm={12}
              xs={12}
            >
              <FormControlLabel
                autoComplete="off"
                control={                    
                    <TextField 
                      variant="outlined"
                      style={{ width: resolucion.width }}                      
                      className={classes.margin}
                      name="descripcion"
                      id="descripcion"
                      value={descripcion}
                      onChange={e => {setDatos({
                        ...datos, 
                        [e.target.name] : e.target.value
                      })}}
                      onInput={e => limiteInput(e,50)}
                    />
                } 
                label={<Typography style={{ width: "20%"}} direction="row">Descripción</Typography>}
                labelPlacement={resolucion.labelPlacement}
              />
            </Grid>
            </Grid>
          </CardContent>
        </Card>
        <Card
            className={classes.card_margin}
          >
            <CardHeader 
              title={"Ubicación"}
            />
            <Divider />
            <CardContent>
            <Grid
                container
                spacing={6}
                wrap="wrap"                
                spacing={2}
              >
                <Grid
                  className={classes.item}
                  item
                  md={12}
                  sm={12}
                  xs={12}
                >
                   <FormControlLabel
                      autoComplete="off"
                      control={                    
                          <Autocomplete
                            id="combo-box-zona"
                            className={classes.margin}
                            onChange={(event, newValue) => {  
                              if(newValue !== null) setZona(newValue);
                              else {
                                setZona([]);
                                setParques([]);
                                setDatos({...datos, "IdParque" : ''})
                              }
                            }}
                            options={zonas}
                            getOptionLabel={(option) => option.Descripcion}
                            style={{ width: resolucion.width }}
                            renderInput={(params) => <TextField {...params} variant="outlined" />}
                          />
                      } 
                      label={<Typography style={{ width: "20%"}} direction="row">Zona</Typography>}
                      labelPlacement={resolucion.labelPlacement}
                    />
                </Grid>
                <Grid
                  className={classes.item}
                  item
                  md={12}
                  sm={12}
                  xs={12}
                >
                   <FormControlLabel
                      autoComplete="off"
                      control={                    
                          <Autocomplete
                            id="combo-box-urbanizacion"
                            key={ 
                              zona.length  !== null ?
                              zona.length !== 0 ? zona.IdZona : false
                              : false
                            }
                            className={classes.margin}
                            onChange={(event, newValue) => {  
                              if(newValue !== null) setUrbanizacion(newValue)
                              else {
                                setUrbanizacion([]); 
                                setParques([]); 
                                setDatos({...datos, "IdParque" : ''})
                              }
                            }}
                            options={urbanizaciones}
                            getOptionLabel={(option) => option.Descripcion}
                            style={{ width: resolucion.width }}
                            renderInput={(params) => <TextField {...params} variant="outlined" />}
                          />
                      } 
                      label={<Typography style={{ width: "20%"}}>Urbanización</Typography>}
                      labelPlacement={resolucion.labelPlacement}
                    />
                </Grid>
                <Grid
                  className={classes.item}
                  item
                  md={12}
                  sm={12}
                  xs={12}
                >
                  <FormControlLabel
                      autoComplete="off"
                      control={                    
                          <Autocomplete
                            id="combo-box-area"
                            className={classes.margin}
                            onChange={(event, newValue) => {                         
                              if(newValue !== null ) 
                              {
                                setArea(newValue); 
                                setDatos({...datos, "IdArea" : newValue.IdArea})
                              }
                              else {
                                setArea([]);
                                setParques([]);
                                setDatos({...datos, "IdArea" : '',"IdParque" : ''});
                              }
                            }}
                            options={areas}
                            getOptionLabel={(option) => option.Descripcion}
                            style={{ width: resolucion.width }}
                            renderInput={(params) => <TextField {...params} variant="outlined" />}
                          />
                      } 
                      label={<Typography style={{ width: "20%"}}>Área</Typography>}
                      labelPlacement={resolucion.labelPlacement}
                    />
                </Grid>
                <Grid
                  className={classes.item}
                  item
                  md={12}
                  sm={12}
                  xs={12}
                >
                  <FormControlLabel
                      autoComplete="off"
                      control={                    
                          <Autocomplete
                            id="combo-box-parque"
                            key={ 
                              urbanizacion.length  !== null ?
                              urbanizacion.length !== 0 ? zona.IdUrbanizacion : false
                              : false
                            }
                            key={ 
                              area.length  !== null ?
                              area.length !== 0 ? area.IdArea : false
                              : false
                            }
                            key={ 
                              zona.length  !== null ?
                              zona.length !== 0 ? zona.IdZona : false
                              : false
                            }
                            className={classes.margin}
                            onChange={(event, newValue) => {  
                              if(newValue !== null ) 
                              {                     
                                setParque(newValue);
                                setDatos({...datos, "IdParque" : newValue.IdParque})
                              }else {
                                setDatos({...datos, "IdParque" : ''})
                              }
                            }}
                            options={parques}
                            getOptionLabel={(option) => option.Descripcion}
                            style={{ width: resolucion.width }}
                            renderInput={(params) => <TextField {...params} variant="outlined" />}
                          />
                      } 
                      label={<Typography style={{ width: "20%"}}>Parque</Typography>}
                      labelPlacement={resolucion.labelPlacement}
                    />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Fragment>
    )
}

export default CrearFormulario;
