import './home.scss';

import React from 'react';
import { Link } from 'react-router-dom';
import { Translate } from 'react-jhipster';
import { connect } from 'react-redux';
import { Row, Col, Alert } from 'reactstrap';

import { IRootState } from 'app/shared/reducers';

export type IHomeProp = StateProps;

export const Home = (props: IHomeProp) => {
  const { account } = props;

  return (
    <Row>
      <Col md="9">
        <h2>
          <Translate contentKey="home.title">Welcome, Java Hipster!</Translate>
        </h2>
        {/* <p className="lead">
          <Translate contentKey="home.subtitle">This is your homepage</Translate>
        </p> */}
        {account && account.login ? (
          <div>
            <Alert color="success">
              <Translate contentKey="home.logged.message" interpolate={{ username: account.login }}>
                You are logged in as user {account.login}.
              </Translate>
            </Alert>
            <Alert>
              <ul>
                <li>
                  <Translate contentKey="home.logged.guide1" > </Translate>
                </li>
                <li>
                  <Translate contentKey="home.logged.guide2" > </Translate>
                </li>
                <li>
                  <Translate contentKey="home.logged.guide3" > </Translate>
                </li>
              </ul>
            </Alert>
          </div>
        ) : (
            <div>
              <Alert color="warning">
                <Translate contentKey="global.messages.info.authenticated.prefix">If you want to </Translate>
                <Link to="/login" className="alert-link">
                  <Translate contentKey="global.messages.info.authenticated.link"> sign in</Translate>
                </Link>
                <Translate contentKey="global.messages.info.authenticated.suffix">
                  , you can try the default accounts:
                <br />- Administrator (login=&quot;admin&quot; and password=&quot;admin&quot;)
                <br />- User (login=&quot;user&quot; and password=&quot;user&quot;).
              </Translate>
              </Alert>

              <p>如果你是老师,我们提供以下功能:</p>
              <Alert>
                <ul>
                  <li>
                    <Translate contentKey="home.teacher.importingStudents"> </Translate>
                  </li>
                  <li>
                    <Translate contentKey="home.teacher.workManagement"> </Translate>
                  </li>
                  <li>
                    <Translate contentKey="home.teacher.publicdocuments"> </Translate>
                  </li>
                </ul>
              </Alert>

              <p>如果你是学生，我们提供以下功能：</p>
              <Alert>
                <ul>
                  <li>
                    <Translate contentKey="home.student.workUse"> </Translate>
                  </li>
                  <li>
                    <Translate contentKey="home.student.publicdocuments"> </Translate>
                  </li>
                </ul>
              </Alert>
              <p>无论你是谁,你都可以：</p>
              <Alert color="primary">
                <Translate contentKey="home.like"> </Translate>
              </Alert>

              {/* <Alert color="warning">
                <Translate contentKey="global.messages.info.register.noaccount">You do not have an account yet?</Translate>&nbsp;
              <Link to="/account/register" className="alert-link">
                  <Translate contentKey="global.messages.info.register.link">Register a new account</Translate>
                </Link>
              </Alert> */}
            </div>
          )}



        {/* <p>点击右上角的"账号"选项去登陆</p> */}
        {/* <p>
          <Translate contentKey="home.like">If you like JHipster, do not forget to give us a star on</Translate>{' '}
          <a href="https://github.com/jhipster/generator-jhipster" target="_blank" rel="noopener noreferrer">
            Github
          </a>
          !
        </p> */}
      </Col>
      <Col md="3" className="pad">
        <span className="hipster rounded" />
      </Col>
    </Row>
  );
};

const mapStateToProps = storeState => ({
  account: storeState.authentication.account,
  isAuthenticated: storeState.authentication.isAuthenticated
});

type StateProps = ReturnType<typeof mapStateToProps>;

export default connect(mapStateToProps)(Home);
