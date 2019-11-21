import React from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, InputGroup, Col, Row, Table } from 'reactstrap';
import { AvForm, AvGroup, AvInput } from 'availity-reactstrap-validation';
import {
  Translate,
  translate,
  ICrudSearchAction,
  ICrudGetAllAction,
  TextFormat,
  getSortState,
  IPaginationBaseState,
  JhiPagination,
  JhiItemCount
} from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getSearchEntities, getEntities } from './homework.reducer';
import { IHomework } from 'app/shared/model/homework.model';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';
import { ITEMS_PER_PAGE } from 'app/shared/util/pagination.constants';
import Axios from 'axios';

export interface IHomeworkProps extends StateProps, DispatchProps, RouteComponentProps<{ url: string }> {}

export interface IHomeworkState extends IPaginationBaseState {
  search: string;
}

export class Homework extends React.Component<IHomeworkProps, IHomeworkState> {
 

  render() {
   const homeworkList=[
    {
        "id": "5dd5149de5134bd0e487197e",
        "fileName": "ddd.txt",
        "owner": null,
        "className": null,
        "editTime": null
    }
]
   
    return (
      <div>
        <h2 id="homework-heading">
          <Translate contentKey="teachermanagerApp.homework.home.title">Homework</Translate>
          <Link to={`ddd/new`} className="btn btn-primary float-right jh-create-entity" id="jh-create-entity">
            <FontAwesomeIcon icon="plus" />
            &nbsp;
            <Translate contentKey="teachermanagerApp.homework.home.createLabel">Create a new Homework</Translate>
          </Link>
        </h2>
        
        <div className="table-responsive">
          {homeworkList && homeworkList.length > 0 ? (
            <Table responsive aria-describedby="homework-heading">
              <thead>
                <tr>
                  <th className="hand" >
                    <Translate contentKey="global.field.id">ID</Translate> <FontAwesomeIcon icon="sort" />
                  </th>
                  <th className="hand" >
                    <Translate contentKey="teachermanagerApp.homework.fileName">File Name</Translate> <FontAwesomeIcon icon="sort" />
                  </th>
                  <th className="hand" >
                    <Translate contentKey="teachermanagerApp.homework.owner">Owner</Translate> <FontAwesomeIcon icon="sort" />
                  </th>
                  <th className="hand" >
                    <Translate contentKey="teachermanagerApp.homework.className">Class Name</Translate> <FontAwesomeIcon icon="sort" />
                  </th>
                  <th className="hand">
                    <Translate contentKey="teachermanagerApp.homework.editTime">Edit Time</Translate> <FontAwesomeIcon icon="sort" />
                  </th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {homeworkList.map((homework, i) => (
                  <tr key={`entity-${i}`}>
                    <td>
                      <Button tag={Link} to={`ddd/${homework.id}`} color="link" size="sm">
                        {homework.id}
                      </Button>
                    </td>
                    <td>{homework.fileName}</td>
                    <td>{homework.owner}</td>
                    <td>{homework.className}</td>
                    <td>
                      <TextFormat type="date" value={homework.editTime} format={APP_DATE_FORMAT} />
                    </td>
                    <td className="text-right">
                      <div className="btn-group flex-btn-group-container">
                        <Button tag={Link} to={`ddd/${homework.id}`} color="info" size="sm">
                          <FontAwesomeIcon icon="eye" />{' '}
                          <span className="d-none d-md-inline">
                            <Translate contentKey="entity.action.view">View</Translate>
                          </span>
                        </Button>
                        <Button tag={Link} to={`ddd/${homework.id}/edit`} color="primary" size="sm">
                          <FontAwesomeIcon icon="pencil-alt" />{' '}
                          <span className="d-none d-md-inline">
                            <Translate contentKey="entity.action.edit">Edit</Translate>
                          </span>
                        </Button>
                        <Button tag={Link} to={`ddd/${homework.id}/delete`} color="danger" size="sm">
                          <FontAwesomeIcon icon="trash" />{' '}
                          <span className="d-none d-md-inline">
                            <Translate contentKey="entity.action.delete">Delete</Translate>
                          </span>
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          ) : (
            <div className="alert alert-warning">
              <Translate contentKey="teachermanagerApp.homework.home.notFound">No Homework found</Translate>
            </div>
          )}
        </div>
        <div className={homeworkList && homeworkList.length > 0 ? '' : 'd-none'}>
         
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ homework }: IRootState) => ({
  homeworkList: homework.entities,
  totalItems: homework.totalItems
});

const mapDispatchToProps = {
  getSearchEntities,
  getEntities
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Homework);
