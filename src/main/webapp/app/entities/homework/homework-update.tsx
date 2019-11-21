import React from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col, Label } from 'reactstrap';
import { AvFeedback, AvForm, AvGroup, AvInput, AvField } from 'availity-reactstrap-validation';
import { Translate, translate, ICrudGetAction, ICrudGetAllAction, ICrudPutAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IRootState } from 'app/shared/reducers';

import { getEntity, updateEntity, createEntity, reset } from './homework.reducer';
import { IHomework } from 'app/shared/model/homework.model';
import { convertDateTimeFromServer, convertDateTimeToServer } from 'app/shared/util/date-utils';
import { mapIdList } from 'app/shared/util/entity-utils';

export interface IHomeworkUpdateProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export interface IHomeworkUpdateState {
  isNew: boolean;
}

export class HomeworkUpdate extends React.Component<IHomeworkUpdateProps, IHomeworkUpdateState> {
  constructor(props) {
    super(props);
    this.state = {
      isNew: !this.props.match.params || !this.props.match.params.id
    };
  }

  componentWillUpdate(nextProps, nextState) {
    if (nextProps.updateSuccess !== this.props.updateSuccess && nextProps.updateSuccess) {
      this.handleClose();
    }
  }

  componentDidMount() {
    if (this.state.isNew) {
      this.props.reset();
    } else {
      this.props.getEntity(this.props.match.params.id);
    }
  }

  saveEntity = (event, errors, values) => {
    values.editTime = convertDateTimeToServer(values.editTime);

    if (errors.length === 0) {
      const { homeworkEntity } = this.props;
      const entity = {
        ...homeworkEntity,
        ...values
      };

      if (this.state.isNew) {
        this.props.createEntity(entity);
      } else {
        this.props.updateEntity(entity);
      }
    }
  };

  handleClose = () => {
    this.props.history.push('/homework');
  };

  render() {
    const { homeworkEntity, loading, updating } = this.props;
    const { isNew } = this.state;

    return (
      <div>
        <Row className="justify-content-center">
          <Col md="8">
            <h2 id="teachermanagerApp.homework.home.createOrEditLabel">
              <Translate contentKey="teachermanagerApp.homework.home.createOrEditLabel">Create or edit a Homework</Translate>
            </h2>
          </Col>
        </Row>
        <Row className="justify-content-center">
          <Col md="8">
            {loading ? (
              <p>Loading...</p>
            ) : (
              <AvForm model={isNew ? {} : homeworkEntity} onSubmit={this.saveEntity}>
                {!isNew ? (
                  <AvGroup>
                    <Label for="homework-id">
                      <Translate contentKey="global.field.id">ID</Translate>
                    </Label>
                    <AvInput id="homework-id" type="text" className="form-control" name="id" required readOnly />
                  </AvGroup>
                ) : null}
                <AvGroup>
                  <Label id="fileNameLabel" for="homework-fileName">
                    <Translate contentKey="teachermanagerApp.homework.fileName">File Name</Translate>
                  </Label>
                  <AvField
                    id="homework-fileName"
                    type="text"
                    name="fileName"
                    validate={{
                      required: { value: true, errorMessage: translate('entity.validation.required') }
                    }}
                  />
                </AvGroup>
                <AvGroup>
                  <Label id="ownerLabel" for="homework-owner">
                    <Translate contentKey="teachermanagerApp.homework.owner">Owner</Translate>
                  </Label>
                  <AvField
                    id="homework-owner"
                    type="text"
                    name="owner"
                    validate={{
                      required: { value: true, errorMessage: translate('entity.validation.required') }
                    }}
                  />
                </AvGroup>
                <AvGroup>
                  <Label id="classNameLabel" for="homework-className">
                    <Translate contentKey="teachermanagerApp.homework.className">Class Name</Translate>
                  </Label>
                  <AvField
                    id="homework-className"
                    type="text"
                    name="className"
                    validate={{
                      required: { value: true, errorMessage: translate('entity.validation.required') }
                    }}
                  />
                </AvGroup>
                <AvGroup>
                  <Label id="editTimeLabel" for="homework-editTime">
                    <Translate contentKey="teachermanagerApp.homework.editTime">Edit Time</Translate>
                  </Label>
                  <AvInput
                    id="homework-editTime"
                    type="datetime-local"
                    className="form-control"
                    name="editTime"
                    placeholder={'YYYY-MM-DD HH:mm'}
                    value={isNew ? null : convertDateTimeFromServer(this.props.homeworkEntity.editTime)}
                    validate={{
                      required: { value: true, errorMessage: translate('entity.validation.required') }
                    }}
                  />
                </AvGroup>
                <Button tag={Link} id="cancel-save" to="/homework" replace color="info">
                  <FontAwesomeIcon icon="arrow-left" />
                  &nbsp;
                  <span className="d-none d-md-inline">
                    <Translate contentKey="entity.action.back">Back</Translate>
                  </span>
                </Button>
                &nbsp;
                <Button color="primary" id="save-entity" type="submit" disabled={updating}>
                  <FontAwesomeIcon icon="save" />
                  &nbsp;
                  <Translate contentKey="entity.action.save">Save</Translate>
                </Button>
              </AvForm>
            )}
          </Col>
        </Row>
      </div>
    );
  }
}

const mapStateToProps = (storeState: IRootState) => ({
  homeworkEntity: storeState.homework.entity,
  loading: storeState.homework.loading,
  updating: storeState.homework.updating,
  updateSuccess: storeState.homework.updateSuccess
});

const mapDispatchToProps = {
  getEntity,
  updateEntity,
  createEntity,
  reset
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(HomeworkUpdate);
