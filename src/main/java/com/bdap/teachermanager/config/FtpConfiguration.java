package com.bdap.teachermanager.config;

import com.bdap.teachermanager.web.rest.HomeworkResource;
import org.apache.commons.net.ftp.FTP;
import org.apache.commons.net.ftp.FTPClient;
import org.apache.commons.net.ftp.FTPReply;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.IOException;

/**
 * @Author XingTianYu
 * @date 2019/11/21 18:53
 */
public class FtpConfiguration {
    private String userName="tseg";
    private String password="tseg";
    private String ftpUrl="10.105.222.90:22";
    private String DefaultPath="/home/tseg/teachermanager";
    public FTPClient client=this.connectFtpServer();
    public FtpConfiguration()throws IOException
    {
      this.client=connectFtpServer();
    }
    public FTPClient connectFtpServer()throws IOException

    {
        final Logger log = LoggerFactory.getLogger(HomeworkResource.class);
        FTPClient ftpClient = new FTPClient();
        ftpClient.setConnectTimeout(1000*30);//设置连接超时时间
        ftpClient.setControlEncoding("utf-8");//设置ftp字符集
        ftpClient.enterLocalPassiveMode();
        //设置被动模式，文件传输端口设置
        try {
            ftpClient.setFileType(FTP.BINARY_FILE_TYPE);
            //设置文件传输模式为二进制，可以保证传输的内容不会被改变
            ftpClient.connect(this.ftpUrl);
            ftpClient.login(userName,password);
            int replyCode = ftpClient.getReplyCode();
            if (!FTPReply.isPositiveCompletion(replyCode)){
                log.error("connect ftp {} failed",this.ftpUrl);
                ftpClient.disconnect();
                return null;
            }
            log.info("replyCode==========={}",replyCode);
        } catch (IOException e) {
            log.error("connect fail ------->>>{}",e.getCause());
            return null;
        }
        return ftpClient;
    }
    public String formPath(String absPath)
    {
        return this.DefaultPath+absPath;
    }
}
