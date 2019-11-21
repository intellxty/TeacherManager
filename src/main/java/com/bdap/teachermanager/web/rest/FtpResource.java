package com.bdap.teachermanager.web.rest;

import org.apache.commons.net.ftp.FTPClient;
import org.apache.commons.net.ftp.FTPFile;
import org.apache.commons.net.ftp.FTPReply;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.bdap.teachermanager.config.FtpConfiguration;

import java.io.IOException;
import java.util.List;

/**
 * @Author XingTianYu
 * @date 2019/11/21 18:51
 */
@RequestMapping("/file")
@RestController
public class FtpResource  {
    FtpConfiguration ftpConfiguration;


    String remoteDir="publicfiles";
    @GetMapping("/homework/{id}")
    List<String> getStudentHomeWork(@PathVariable String id) throws IOException
    {
        ftpConfiguration=new FtpConfiguration();
        ftpConfiguration.client.changeWorkingDirectory(remoteDir);
        FTPFile[] ftpFiles = ftpConfiguration.client.listFiles(remoteDir);
        return null;
    }
}
