package com.bdap.teachermanager.service;

import com.bdap.teachermanager.config.FtpConfiguration;
import com.bdap.teachermanager.web.rest.HomeworkResource;
import com.jcraft.jsch.ChannelSftp;
import com.jcraft.jsch.SftpException;
import io.swagger.models.auth.In;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStream;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Vector;

/**
 * @Author XingTianYu
 * @date 2019/11/22 11:44
 */
@Service
public class FtpService {

    Logger log = LoggerFactory.getLogger(HomeworkResource.class);
    public boolean uploadFiles(ChannelSftp sftp,String path, MultipartFile file) throws  Exception
    {
        List<String> pathlist = new ArrayList(Arrays.asList(path.split("/")));
        pathlist.remove(pathlist.size()-1);
        boolean isFile;
        String currentPath="";
        for(String curdir:pathlist ) {
            if(!curdir.equals("")) {
                currentPath += "/" + curdir;
                try {
                    sftp.cd(currentPath);
                    isFile = true;
                } catch (SftpException e) {
                    isFile = false;
                }
                if (!isFile) {
                    sftp.mkdir(currentPath);
                }
            }
        }
        try {
            sftp.put(file.getInputStream(), path);
            return true;
        }
        catch(Exception e)
        {
            log.debug(e.toString());
        }
        return false;
    }

    public InputStream downloadFiles(ChannelSftp sftp, String path) throws Exception
    {
        try {
            return sftp.get(path);
        }
        catch (Exception e)
        {
            log.debug(e.toString());
        }
        return null;

    }

    public boolean deleteFiles(ChannelSftp sftp,String path)throws Exception
    {
        try {
            sftp.rm(path);
            return true;
        }
        catch(Exception e)
        {
            log.debug(e.toString());
        }
        return false;
    }

}
