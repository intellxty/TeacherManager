import React from 'react';
import {Row,Col,Table,Button, Modal} from 'antd';
import 'antd/dist/antd.css';
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
           <Modal title="上传文件" onOk={this.uploadrequest} onCancel={this.uploadrequest} visible={this.state.Modalvisible}>
           </Modal>
         </Row>
         </Col>
            
         <Col span={12}>
         <Table column={this.state.studentColumns} dataSource={this.state.studentData}></Table>
         </Col>

     </Row>


    </div>
)
}
}
export default Add;