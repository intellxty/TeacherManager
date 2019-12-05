import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Table, Row, Badge } from 'reactstrap';
import { Translate, TextFormat, JhiPagination, JhiItemCount, getSortState } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { APP_DATE_FORMAT } from 'app/config/constants';
import { ITEMS_PER_PAGE } from 'app/shared/util/pagination.constants';
import { getUsers, updateUser } from './user-management.reducer';
import { IRootState } from 'app/shared/reducers';

export interface IUserManagementProps extends StateProps, DispatchProps, RouteComponentProps<{}> {}

export const UserManagement = (props: IUserManagementProps) => {
  const [pagination, setPagination] = useState(getSortState(props.location, ITEMS_PER_PAGE));

  const getAllUsers = () => props.getUsers(pagination.activePage - 1, pagination.itemsPerPage, `${pagination.sort},${pagination.order}`);

  useEffect(() => {
    getAllUsers();
  }, []);

  const sortUsers = () => getAllUsers();

  useEffect(() => {
    sortUsers();
  }, [pagination.activePage, pagination.order, pagination.sort]);

  const sort = p => () => {
    setPagination({
      ...pagination,
      order: pagination.order === 'asc' ? 'desc' : 'asc',
      sort: p
    });
    props.history.push(`${props.location.pathname}?page=${pagination.activePage}&sort=${pagination.sort},${pagination.order}`);
  };

  const handlePagination = currentPage =>
    setPagination({
      ...pagination,
      activePage: currentPage
    });

 

  const { users, account, match, totalItems } = props;
  return (
    <div>
      <h2 id="user-management-page-heading">
        <Translate contentKey="userManagement.home.title">Users</Translate>
      
        <Link to={`${match.url}/new/addDataFromFile`} className="btn btn-primary float-right jh-create-entity">
          <FontAwesomeIcon icon="plus" /> 批量导入用户
        </Link>
        <Link to={`${match.url}/new/deleteAllUser`} className="btn btn-primary float-right jh-create-entity" 
        style={{marginRight:10}}>
          <FontAwesomeIcon icon="plus" /> 清空所有非管理员用户
        </Link>
      </h2>
      <Table responsive striped>
        <thead>
          <tr>
            
            <th className="hand" onClick={sort('login')}>
              <Translate contentKey="userManagement.login">Login</Translate>
              <FontAwesomeIcon icon="sort" />
            </th>
          
            <th>
              <Translate contentKey="userManagement.profiles">Profiles</Translate>
            </th>
            <th className="hand" onClick={sort('createdDate')}>
              <Translate contentKey="userManagement.createdDate">Created Date</Translate>
              <FontAwesomeIcon icon="sort" />
            </th>
          
            <th className="hand" >
              <Translate contentKey="userManagement.operation">Created Date</Translate>
            </th>
           
          </tr>
        </thead>
        <tbody>
          {users.map((user, i) => (
            <tr id={user.login} key={`user-${i}`}>
              
              <td>{user.login}</td>
             
              <td>
                {user.authorities
                  ? user.authorities.map((authority, j) => (
                      <div key={`user-auth-${i}-${j}`}>
                        <Badge color="info">{authority}</Badge>
                      </div>
                    ))
                  : null}
              </td>
              <td>
                <TextFormat value={user.createdDate} type="date" format={APP_DATE_FORMAT} blankOnInvalid />
              </td>
             
              <td >
                <div className="btn-group flex-btn-group-container">
                  <Button tag={Link} to={`${match.url}/${user.login}`} color="info" size="sm">
                    <FontAwesomeIcon icon="eye" />{' '}
                    <span className="d-none d-md-inline">
                      <Translate contentKey="entity.action.view">View</Translate>
                    </span>
                  </Button>
                  <Button tag={Link} to={`${match.url}/${user.login}/edit`} color="primary" size="sm">
                    <FontAwesomeIcon icon="pencil-alt" />{' '}
                    <span className="d-none d-md-inline">
                      <Translate contentKey="entity.action.edit">Edit</Translate>
                    </span>
                  </Button>
                  <Button
                    tag={Link}
                    to={`${match.url}/${user.login}/delete`}
                    color="danger"
                    size="sm"
                    disabled={account.login === user.login}
                  >
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
      <div className={users && users.length > 0 ? '' : 'd-none'}>
        <Row className="justify-content-center">
          <JhiItemCount page={pagination.activePage} total={totalItems} itemsPerPage={pagination.itemsPerPage} i18nEnabled />
        </Row>
        <Row className="justify-content-center">
          <JhiPagination
            activePage={pagination.activePage}
            onSelect={handlePagination}
            maxButtons={5}
            itemsPerPage={pagination.itemsPerPage}
            totalItems={props.totalItems}
          />
        </Row>
      </div>
    </div>
  );
};

const mapStateToProps = (storeState: IRootState) => ({
  users: storeState.userManagement.users,
  totalItems: storeState.userManagement.totalItems,
  account: storeState.authentication.account
});

const mapDispatchToProps = { getUsers, updateUser };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UserManagement);
