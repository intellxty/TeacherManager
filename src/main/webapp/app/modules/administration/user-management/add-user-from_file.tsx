import React from 'react';
import {Row,Col,Table,Button, Modal,Upload,Icon} from 'antd';
import 'antd/dist/antd.css';
import { getUsers, updateUser } from './user-management.reducer';
import { async } from 'rxjs/internal/scheduler/async';
class Add extends React.Component{
    state={
        studentColumns:[],
        studentData:[],
        Modalvisible:false,
        fileType:"",
    }
    uploadrequest=()=>
    {   
        const {Modalvisible}=this.state;
        this.setState({
            Modalvisible:!Modalvisible
        });
    }
componentWillMount=async()=>(
    this.setState({studentData:await getUsers()})
)
render(){
    const fileColumns=[{}];
    const fileData=[{}];
    
    return(
    <div>
     <Row>
         <h2 style={{borderBottom:"1px solid    "}}>批量导入学生</h2>
     </Row>
     <Row>
         <div style={{height:"100px",width:"100%"}}>
             <div style={{left:"7%",width:"50%",float:"left"}}> <h3>上传文件</h3></div>
             <div style={{width:"50%",float:"left"}}><h3>学生名单</h3></div>
         </div>
     </Row>
     <Row>
         <Col span={12}>
         <Row>
           <div ><Button  onClick={this.uploadrequest} style={{width:"45%",height:"300px",float:"left",textAlign:"center"}}
           >
               点此上传CSV文件，将来换成背景图片</Button></div>
           <div ><Button onClick={this.uploadrequest} style={{width:"45%",height:"300px",float:"left",textAlign:"center"}}
           >
               点此上传xls文件，将来换成背景图片</Button></div>
           <Modal title="上传文件" width={800} onOk={this.uploadrequest} onCancel={this.uploadrequest} visible={this.state.Modalvisible}>
           <Row>
            <Col span={10}>
           <Upload action="/user/addUserFromDirectory" directory>
                <Button>
                <Icon type="upload" /> 选择文件夹
                </Button>
            </Upload>
            <div style={{height:"80px"}}></div>
            <Upload action="/addUserFromFile">
                <Button>
                <Icon type="upload" /> 选择文件
                </Button>
            </Upload>
            </Col>
            <Col span={14}>
            <Row><h3>文件格式预览</h3></Row>
            <Row><Table columns={[]} dataSource={[]}></Table></Row>
            </Col>
            </Row>
           </Modal>
         </Row>
         </Col>
            
         <Col span={12}>
         <Table columns={[]} dataSource={[]}></Table>
         </Col>

     </Row>


    </div>
)
}
}
export default Add;