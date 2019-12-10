import React from 'react';
import {connect} from 'react-redux';
import {Link, RouteComponentProps} from 'react-router-dom';
import {Button, InputGroup, Table} from 'reactstrap';
import {Icon, Upload} from 'antd'
import {
  Translate,
  TextFormat,
  IPaginationBaseState,

} from 'react-jhipster';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {message, Row, Col, Popconfirm} from "antd";
import 'antd/dist/antd.css';
import {IRootState} from 'app/shared/reducers';
import {getSearchEntities, getEntities} from './homework.reducer';
import {APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT} from 'app/config/constants';
import Axios from 'axios';


export interface IHomeworkProps extends StateProps, DispatchProps, RouteComponentProps<{ url: string }> {
}

export interface IHomeworkState extends IPaginationBaseState {
  search: string;
}

export class Homework extends React.Component<IHomeworkProps> {
  state = {
    userInfo: null,
    homeworkList: [],
    isadmin: false,
  }

  componentWillMount() {
    Axios.get('/api/account')
      .then(response => {
        this.setState({userInfo: response.data, isadmin: response.data.authorities.indexOf("ROLE_ADMIN") !== -1})
        if (!this.state.isadmin) {
          Axios.get(`/api/homework/student/${this.state.userInfo.login}`)
            .then(res => {
              this.setState({homeworkList: res.data})
            })
        } else {
          Axios.get(`/api/homework/`)
            .then(res => {
              this.setState({homeworkList: res.data})
            })
        }
      })

  }

  handledownload = (homework) => {
    Axios.get(`/api/homework/download?fileName=${homework.fileName}&owner=${homework.owner}&className=${homework.className}`, {responseType: 'blob'}).then(blob => {
      const aLink = document.createElement('a');
      document.body.appendChild(aLink);
      aLink.style.display = 'none';
      const objectUrl = window.URL.createObjectURL(blob.data);
      aLink.href = objectUrl;
      aLink.download = homework.fileName;
      aLink.click();
      document.body.removeChild(aLink);
    });
  }
  handledelete = (homework) => {
    Axios.delete(`/api/homework`, {
      params: {
        fileName: homework.fileName,
        owner: homework.owner,
        className: homework.className
      }
    }).then(response => {
      if (response.status === 200) {
        message.success("删除文件成功！");
        this.setState({homeworkList: this.state.homeworkList.filter(r => r.fileName !== homework.fileName)});
      }
    });
  }

  handleupload = (file) => {
    if (file.file.status === "done") {
      Axios.get(`/api/homework/student/${this.state.userInfo.login}`)
        .then(res => {
          this.setState({homeworkList: res.data})
        })
    }
  }


  render() {
    const {homeworkList, userInfo} = this.state;
    const {match} = this.props;
    const className = userInfo === null ? "" : userInfo.className;
    const owner = userInfo === null ? "" : userInfo.login;
    return (

      <div>
        <h2 id="homework-heading">
          <Row>
            <Col span={21}>
              <Translate contentKey="teachermanagerApp.homework.home.title">Homework</Translate>
            </Col>
            <Col span={3}>
              {
                this.state.isadmin ?

                  <Link to={`${match.url}/check`} className="btn btn-primary float-right jh-create-entity"
                        id="jh-create-entity" style={{whiteSpace: 'nowrap'}}>
                    查看作业情况
                  </Link>
                  :
                  <Upload
                    action="/api/homework"
                    method="put"
                    data={{className, owner}}
                    onChange={this.handleupload}
                    headers={{Authorization: `Bearer ${sessionStorage.getItem("jhi-authenticationToken").replace("\"", "")}`}}>
                    <Button color="primary">
                      <Icon type="upload" style={{fontSize: 24}}/>上传作业
                    </Button>
                  </Upload>
              }
            </Col>
          </Row>
        </h2>

        <div className="table-responsive">
          {homeworkList && homeworkList.length > 0 ? (
            <Table responsive aria-describedby="homework-heading">
              <thead>
              <tr>
                <th className="hand">
                  <Translate contentKey="global.field.id">ID</Translate> <FontAwesomeIcon icon="sort"/>
                </th>
                <th className="hand">
                  <Translate contentKey="teachermanagerApp.homework.fileName">File Name</Translate> <FontAwesomeIcon
                  icon="sort"/>
                </th>
                <th className="hand">
                  <Translate contentKey="teachermanagerApp.homework.owner">Owner</Translate> <FontAwesomeIcon
                  icon="sort"/>
                </th>
                <th className="hand">
                  <Translate contentKey="teachermanagerApp.homework.className">Class Name</Translate> <FontAwesomeIcon
                  icon="sort"/>
                </th>
                <th className="hand">
                  <Translate contentKey="teachermanagerApp.homework.editTime">Edit Time</Translate> <FontAwesomeIcon
                  icon="sort"/>
                </th>
                <th className="hand">
                  <Translate contentKey="teachermanagerApp.homework.operation">operation</Translate>
                </th>
              </tr>
              </thead>
              <tbody>
              {homeworkList.map((homework, i) => (
                <tr key={`entity-${i}`}>
                  <td>
                    <Button tag={Link} to={`${match.url}/${homework.id}`} color="link" size="sm">
                      {homework.id}
                    </Button>
                  </td>
                  <td>{homework.fileName}</td>
                  <td>{homework.owner}</td>
                  <td>{homework.className}</td>
                  <td>
                    <TextFormat type="date" value={homework.editTime} format={APP_DATE_FORMAT}/>
                  </td>
                  <td>
                    <div className="btn-group flex-btn-group-container">
                      <Button onClick={this.handledownload.bind(this, homework)} color="info" size="sm">
                        <Icon type="download" style={{fontSize: 18}}/>{' '}
                        <span className="d-none d-md-inline">
                            下载
                          </span>
                      </Button>
                      <Popconfirm title="确定删除吗" onConfirm={this.handledelete.bind(this, homework)}
                                  okText="Yes"
                                  cancelText="No">
                        <Button color="danger" size="sm">
                          <FontAwesomeIcon icon="trash"/>{' '}
                          <span className="d-none d-md-inline">
                              <Translate contentKey="entity.action.delete">Delete</Translate>
                            </span>
                        </Button>
                      </Popconfirm>
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

const mapStateToProps = ({homework}: IRootState) => ({
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
