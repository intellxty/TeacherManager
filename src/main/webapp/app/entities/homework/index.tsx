import React from 'react';
import { Switch } from 'react-router-dom';

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import Homework from './homework';
import HomeworkDetail from './homework-detail';
import HomeworkUpdate from './homework-update';
import HomeworkDeleteDialog from './homework-delete-dialog';

const Routes = ({ match }) => (
  <>
    <Switch>
      <ErrorBoundaryRoute exact path={`${match.url}/new`} component={HomeworkUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id/edit`} component={HomeworkUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id`} component={HomeworkDetail} />
      <ErrorBoundaryRoute path={match.url} component={Homework} />
    </Switch>
    <ErrorBoundaryRoute path={`${match.url}/:id/delete`} component={HomeworkDeleteDialog} />
  </>
);

export default Routes;
