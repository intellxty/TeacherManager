import React from 'react';
import {Input, Row, Col, Button, Icon} from 'antd';
import {Table} from 'reactstrap';
import Axios from 'axios';
import 'antd/dist/antd.css';

class HomeworkCheck extends React.Component {
  state = {
    className: "",
    keyword: "",
    checkList: [],
  }

  setClassNameChange(className) {
    this.setState({className: className.target.value});
  }

  setKeywordChange(keyword) {
    this.setState({keyword: keyword.target.value});
  }

  handleSearch = () => {
    Axios.get(`/api/homework/select?className=${this.state.className}&keyword=${this.state.keyword}`).then(
      res => {
        this.setState({checkList: Array.from(res.data)})
        console.log(this.state.checkList)
      }
    )
  }
  handleDownloadZip = () => {
    Axios.get(`/api/homework/downloadzip?className=${this.state.className}&keyword=${this.state.keyword}`, {responseType: 'blob'}).then(blob => {
      const aLink = document.createElement('a');
      document.body.appendChild(aLink);
      aLink.style.display = 'none';
      const objectUrl = window.URL.createObjectURL(blob.data);
      aLink.href = objectUrl;
      aLink.download = this.state.className + ".zip";
      aLink.click();
      document.body.removeChild(aLink);
    });
  }

  render() {
    const {checkList} = this.state;
    return (
      <div>
        <h2>作业检查</h2>
        <Row style={{marginBottom: '.8rem'}}>
          <Col style={{marginBottom: '.8rem'}}>
            <Input placeholder="请输入班级名称" onChange={this.setClassNameChange.bind(this)}/>
          </Col>
          <Col style={{marginBottom: '.8rem'}}>
            <Input placeholder="请输入作业关键字" onChange={this.setKeywordChange.bind(this)}/>
          </Col>
          <Col>
            <Button.Group>
              <Button
                type="primary"
                onClick={this.handleSearch}
              >
                <div style={{display: 'flex', alignItems: 'center'}}>
                  <Icon type={"thunderbolt"} style={{marginRight: '.2rem'}}/>检查
                </div>
              </Button>
              <Button
                type="primary"
                onClick={this.handleDownloadZip}
              >
                <div style={{display: 'flex', alignItems: 'center'}}>
                  <Icon type={"download"} style={{marginRight: '.2rem'}}/>打包下载
                </div>
              </Button>
            </Button.Group>
          </Col>
        </Row>
        <Row>
          <Table responsive aria-describedby="homework-heading">
            <thead>
            <tr>
              <th className="hand">
                学生ID
              </th>
              <th className="hand">
                是否存在符合条件的已上传作业
              </th>
            </tr>
            </thead>
            <tbody>
            {checkList !== [] ? checkList.map((info, i) => (
              <tr key={`entity-${i}`}>
                <td>{info.owner}</td>
                <td>{info.iscomplete}</td>
              </tr>
            )) : null
            }
            </tbody>
          </Table>

        </Row>
      </div>
    )
  }
}

export default HomeworkCheck;
