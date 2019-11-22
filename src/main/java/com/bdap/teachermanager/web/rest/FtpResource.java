package com.bdap.teachermanager.web.rest;

import com.bdap.teachermanager.domain.Homework;
import com.bdap.teachermanager.domain.Publicfiles;
import com.bdap.teachermanager.service.FtpService;
import com.jcraft.jsch.ChannelSftp;
import com.jcraft.jsch.ChannelSftp.LsEntry;
import org.apache.commons.compress.utils.IOUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.configurationprocessor.json.JSONObject;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.bdap.teachermanager.config.FtpConfiguration;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.URLEncoder;
import java.util.ArrayList;
import java.util.List;
import java.util.Vector;

/**
 * @Author XingTianYu
 * @date 2019/11/21 18:51
 */
@RequestMapping("/file")
@RestController
public class FtpResource  {
    FtpConfiguration ftpConfiguration=new FtpConfiguration();
    ChannelSftp sftp=ftpConfiguration.sftp;
    @Autowired
    FtpService ftpService;
    Logger log = LoggerFactory.getLogger(HomeworkResource.class);


    @GetMapping("/public")
    ResponseEntity<List<Publicfiles>> getStudentHomeWork() throws Exception
    {
        List<Publicfiles> publicFilesList=new ArrayList();
        Vector<?> vector = sftp.ls(ftpConfiguration.DefaultPath+ftpConfiguration.pubicFilesDir);
        for (Object item:vector) {

        LsEntry entry = (ChannelSftp.LsEntry) item;
        Publicfiles publicfiles=new Publicfiles(entry.getFilename(),entry.getAttrs().toString().split(" "));
        publicFilesList.add(publicfiles);
    }
        return new ResponseEntity<>(publicFilesList, HttpStatus.OK);
    }
    @PutMapping("/public")
    ResponseEntity<Void> uploadPublicFiles(HttpServletRequest request)throws Exception
    {
        MultipartHttpServletRequest multipartRequest = (MultipartHttpServletRequest) request;
        MultipartFile file = multipartRequest.getFile("file");
        return (ftpService.uploadFiles(sftp,ftpConfiguration.DefaultPath +ftpConfiguration.pubicFilesDir +"/"+file.getOriginalFilename(),file))?new ResponseEntity<>(HttpStatus.OK):new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }
    @PostMapping("/public")
    Object downloadPublicFiles(HttpServletRequest request)throws Exception
    {
        String fileName=request.getParameter("fileName");
        HttpHeaders httpHeaders = new HttpHeaders();
        httpHeaders.add("Content-Disposition", "attachment;filename=" + URLEncoder.encode(fileName,"UTF-8"));
        InputStream stream=ftpService.downloadFiles(sftp,ftpConfiguration.DefaultPath+ftpConfiguration.pubicFilesDir+"/"+fileName);
        if(stream!=null) {
            byte[] body = IOUtils.toByteArray(stream);
            return ResponseEntity.ok().headers(httpHeaders)
                .contentType(MediaType.parseMediaType("application/octet-stream")).body(body);
        }
        else {return null;}
    }
    @DeleteMapping("/public")
    Object deletePublicFiles( @RequestParam String fileName)throws Exception
    {
        return ftpService.deleteFiles(sftp,ftpConfiguration.DefaultPath + ftpConfiguration.pubicFilesDir+"/"+fileName)?new ResponseEntity<>(HttpStatus.OK):new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }
}


