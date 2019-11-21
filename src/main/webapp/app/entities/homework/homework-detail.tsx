import React from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
import { Translate, ICrudGetAction, TextFormat } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntity } from './homework.reducer';
import { IHomework } from 'app/shared/model/homework.model';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';

export interface IHomeworkDetailProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export class HomeworkDetail extends React.Component<IHomeworkDetailProps> {
  componentDidMount() {
    this.props.getEntity(this.props.match.params.id);
  }

  render() {
    const { homeworkEntity } = this.props;
    return (
      <Row>
        <Col md="8">
          <h2>
            <Translate contentKey="teachermanagerApp.homework.detail.title">Homework</Translate> [<b>{homeworkEntity.id}</b>]
          </h2>
          <dl className="jh-entity-details">
            <dt>
              <span id="fileName">
                <Translate contentKey="teachermanagerApp.homework.fileName">File Name</Translate>
              </span>
            </dt>
            <dd>{homeworkEntity.fileName}</dd>
            <dt>
              <span id="owner">
                <Translate contentKey="teachermanagerApp.homework.owner">Owner</Translate>
              </span>
            </dt>
            <dd>{homeworkEntity.owner}</dd>
            <dt>
              <span id="className">
                <Translate contentKey="teachermanagerApp.homework.className">Class Name</Translate>
              </span>
            </dt>
            <dd>{homeworkEntity.className}</dd>
            <dt>
              <span id="editTime">
                <Translate contentKey="teachermanagerApp.homework.editTime">Edit Time</Translate>
              </span>
            </dt>
            <dd>
              <TextFormat value={homeworkEntity.editTime} type="date" format={APP_DATE_FORMAT} />
            </dd>
          </dl>
          <Button tag={Link} to="/homework" replace color="info">
            <FontAwesomeIcon icon="arrow-left" />{' '}
            <span className="d-none d-md-inline">
              <Translate contentKey="entity.action.back">Back</Translate>
            </span>
          </Button>
          &nbsp;
          <Button tag={Link} to={`/homework/${homeworkEntity.id}/edit`} replace color="primary">
            <FontAwesomeIcon icon="pencil-alt" />{' '}
            <span className="d-none d-md-inline">
              <Translate contentKey="entity.action.edit">Edit</Translate>
            </span>
          </Button>
        </Col>
      </Row>
    );
  }
}

const mapStateToProps = ({ homework }: IRootState) => ({
  homeworkEntity: homework.entity
});

const mapDispatchToProps = { getEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(HomeworkDetail);
