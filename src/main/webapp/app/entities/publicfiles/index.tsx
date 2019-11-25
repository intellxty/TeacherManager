import React from'react'
import Axios from 'axios';
import {  Table } from 'reactstrap';
import { Button, Popconfirm, message, Upload, Row, Col,Icon} from 'antd';
import 'antd/dist/antd.css';
export default class Publicfiles extends React.Component{
   state={
       fileInfo:[],
       isadmin:false,//判断用户是否为管理员身份
       userInfo:[],
   }
    componentWillMount()
    {
        Axios.get('/api/account')
        .then(response=>{
          this.setState({isadmin:response.data.authorities.indexOf("ROLE_ADMIN")!==-1,
          userInfo:response.data})});
        Axios.get('/file/public').then(
            response=>{
                this.setState({fileInfo:response.data.filter(r=>(r.fileName!=='.'&& r.fileName!=='..'))});
            }
        )
    }
    handledownload=(fileName)=>{
        Axios.get(`/file/public/download?fileName=${fileName}`,{responseType: 'blob'}).then(blob => {
            const aLink = document.createElement('a');
            document.body.appendChild(aLink);
            aLink.style.display='none';
            const objectUrl = window.URL.createObjectURL(blob.data);
            aLink.href = objectUrl;
            aLink.download = fileName;
            aLink.click();
            document.body.removeChild(aLink);
          });
    }
    handledelete=(name)=>{
        Axios.delete(`/file/public`,{params:{fileName:name}}).then(response=>{
            if(response.status===200)
            {
               message.success("删除文件成功！");
            this.setState({fileInfo:this.state.fileInfo.filter(r=>r.fileName!==name)});
            }
        })
    }
    handleupload=(data,event)=>{
        if(data.file.status==="done")
        {
        Axios.get('/file/public').then(
            response=>{
                this.setState({fileInfo:response.data.filter(r=>(r.fileName!=='.'&& r.fileName!=='..'))});
            }
        )
        }
    }
    render()
    {
        
        return(
                <div>
                  <h2><Row>
                      <Col span={20}> 公用文件管理</Col>
                      <Col span={4} style={{right:"0px"}}>{this.state.isadmin?<Upload action="/file/public" method="put" style={{right:"50px"}} onChange={this.handleupload}><Button type="primary" size="large">
                         <Icon type="upload" style={{fontSize:24}}/>上传新文件
                      </Button></Upload>:null}</Col>
                      </Row></h2>
                  <Table responsive aria-describedby="homework-heading">
                  <thead>
                    <tr>
                      <th className="hand" >文件名</th>
                      <th className="hand" >文件大小</th>
                      <th className="hand" >修改时间</th>
                      <th className="hand" >操作</th>
                    </tr>
                  </thead>
                  <tbody>
                      {this.state.fileInfo.map((item,key)=>(
                        <tr key={`entity-${key}`}>
                        <td>{item.fileName}</td>
                        <td>{item.fileSize}</td>
                        <td>{item.editTime}</td>
                        <td>{this.state.isadmin?
                        
                            <span><Popconfirm title="确定删除吗" onConfirm={this.handledelete.bind(this,item.fileName)}
                            okText="Yes"
                            cancelText="No"><Button type="primary" >删除</Button></Popconfirm>&nbsp;</span>:null
                        }
                            <Button onClick ={this.handledownload.bind(this,item.fileName)}type="primary" >下载</Button></td>   
                        </tr>
                      

                          ))}
                  </tbody>
                  </Table>
                  </div>
        )
    }
}