import React from 'react';
import { Switch } from 'react-router-dom';

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';
import UserManagement from './user-management';
import UserManagementDetail from './user-management-detail';
import UserManagementUpdate from './user-management-update';
import UserManagementDeleteDialog from './user-management-delete-dialog';
import { Route, RouteProps } from 'react-router-dom';
import Add from './add-user-from_file'
const Routes = ({ match }) => (
  <>
    <Switch>
      <ErrorBoundaryRoute exact path={`${match.url}/new/new1`} component={UserManagementUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:login/edit`} component={UserManagementUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:login`} component={UserManagementDetail} />
      <ErrorBoundaryRoute exact path={`${match.url}/new/addDataFromFile`} component={Add} />
      <ErrorBoundaryRoute path={match.url} component={UserManagement} />
    </Switch>
    <ErrorBoundaryRoute path={`${match.url}/:login/delete`} component={UserManagementDeleteDialog} />
  </>
);

export default Routes;
