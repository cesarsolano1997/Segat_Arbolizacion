import React from 'react';
import { Switch,Route, Redirect } from 'react-router-dom';

import { RouteWithLayout } from './components';
import { Main as MainLayout, Minimal as MinimalLayout } from './layouts';

import {
  Dashboard as DashboardView,
  Settings as SettingsView,
  SignIn as SignInView,
  Formulario as FormularioView,
  NotFound as NotFoundView,
  Caracteristica as CaracteristicaView
} from './views';

import CrearUsuario from './views/Usuarios/Usuarios';

import AuthState from './context/autenticacion/authState';

const Routes = () => {

  return (
    
    <AuthState>
     <Switch>
      <Redirect
        exact
        from="/"
        to="/dashboard"
      />
      <RouteWithLayout
        component={DashboardView}
        exact
        layout={MainLayout}
        path="/dashboard"
      />
      <RouteWithLayout
        component={FormularioView}
        exact
        layout={MainLayout}
        path="/formulario"
      />

      <RouteWithLayout
        component={CaracteristicaView}
        exact
        layout={MainLayout}
        path="/formulario/caracteristica"
      />
      <Route
        component={SignInView}
        exact
        path="/login" />
        
      <RouteWithLayout
        component={NotFoundView}
        exact
        layout={MinimalLayout}
        path="/not-found"
      />
      
      <RouteWithLayout 
        component={CrearUsuario}
        exact
        layout={MainLayout}
        path="/usuarios"
      />      
      
      <RouteWithLayout
        component={SettingsView}
        exact
        layout={MainLayout}
        path="/settings"
      />
      <Redirect to="/not-found" />
    </Switch>
    </AuthState>
  );
};

export default Routes;
