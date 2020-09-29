import React,{ useContext, useEffect} from 'react';
import { Route,Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';

import AuthContext from '../../context/autenticacion/authContext';

const RouteWithLayout = props => {
  const { layout: Layout, component: Component, ...rest } = props;

  const authContext = useContext(AuthContext);
  const { autenticado, usuarioAutenticado } = authContext;

  useEffect(() => {
      usuarioAutenticado();
      // eslint-disable-next-line
  }, [])
  const token = localStorage.getItem('token');
  
  return !autenticado && !token ? 
        <Route 
            {...rest}
            render={matchProps => <Redirect to="/login" />}
        />
    :
        <Route
          {...rest}
          render={matchProps => <Layout>
              <Component {...matchProps} />
          </Layout>}
        />

    // <Route
    //   {...rest}
    //   render={matchProps =>  !autenticado && !token  ? (        
    //       <Redirect to="/login" />
    //   ) : <Layout>
    //         <Component {...matchProps} />
    //       </Layout>}
    // />
  //);
};

RouteWithLayout.propTypes = {
  component: PropTypes.any.isRequired,
  layout: PropTypes.any.isRequired,
  path: PropTypes.string
};

export default RouteWithLayout;
