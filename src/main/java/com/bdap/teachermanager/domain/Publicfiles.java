package com.bdap.teachermanager.domain;

import java.text.DecimalFormat;

/**
 * @Author XingTianYu
 * @date 2019/11/22 16:09
 */
public class Publicfiles {
    private String fileName;
    private String fileSize;
    private String editTime;
    public Publicfiles(String fileName,String []attr){
        this.fileName=fileName;
        this.fileSize=this.parseByteToSize(Integer.parseInt(attr[3]));
        this.editTime=this.formDateTime(attr);
    }
    public String getEditTime() {
        return editTime;
    }

    public String getFileSize() {
        return fileSize;
    }

    public String getFileName() {
        return fileName;
    }

    public void setEditTime(String editTime) {
        this.editTime = editTime;
    }

    public void setFileName(String fileName) {
        this.fileName = fileName;

    }

    public void setFileSize(String fileSize) {
        this.fileSize = fileSize;
    }
    public String parseByteToSize (int Bytes){
        DecimalFormat df   = new DecimalFormat("######0.00");
        return  Bytes>1024?Bytes>1024*1024?Bytes>1024*1024*1024?df.format(Bytes/(1024.0*1024*1024))+" GB":df.format(Bytes/(1024.0*1024))+" MB":df.format(Bytes/(1024.0))+" KB":String.valueOf(Bytes)+" B";
    }
    public String formDateTime(String[] attr)
    {
        return attr[4]+" "+attr[5]+" "+attr[6]+" "+attr[7]+" "+attr[8]+" "+attr[9];
    }

}
