package com.bdap.teachermanager.config;

import com.bdap.teachermanager.web.rest.HomeworkResource;
import java.util.ArrayList;
import java.util.List;
import java.util.Properties;
import java.util.Vector;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.jcraft.jsch.Channel;
import com.jcraft.jsch.ChannelSftp;
import com.jcraft.jsch.ChannelSftp.LsEntry;
import com.jcraft.jsch.JSch;
import com.jcraft.jsch.Session;


import java.io.IOException;

/**
 * @Author XingTianYu
 * @date 2019/11/21 18:53
 */
@Data
@AllArgsConstructor
public class FtpConfiguration {
    private static final Logger LOG = LoggerFactory.getLogger(FtpConfiguration.class);
    private String userName="tseg";
    private String password="tseg";
    private String ftpUrl="10.105.222.90";
    private int ftpPort=22;
    public String DefaultPath="/home/tseg/teachermanager";
    public String homeWorkDir="/homework";
    public String pubicFilesDir="/publicfiles";
    public ChannelSftp sftp;
    public FtpConfiguration() {
        this.sftp=getsftp(ftpUrl,ftpPort,userName,password,DefaultPath);
    }
    private static ChannelSftp getsftp(String host, int port, String username, final String password, String dir) {
        List<String> list = new ArrayList<String>();
        ChannelSftp sftp = null;
        Channel channel = null;
        Session sshSession = null;
        try {
            JSch jsch = new JSch();
            jsch.getSession(username, host, port);
            sshSession = jsch.getSession(username, host, port);
            sshSession.setPassword(password);
            Properties sshConfig = new Properties();
            sshConfig.put("StrictHostKeyChecking", "no");
            sshSession.setConfig(sshConfig);
            sshSession.connect();
            LOG.debug("Session connected!");
            channel = sshSession.openChannel("sftp");
            channel.connect();
            LOG.debug("Channel connected!");
           sftp = (ChannelSftp) channel;
            /*Vector<?> vector = sftp.ls(dir);
            for (Object item:vector) {
                LsEntry entry = (LsEntry) item;
                System.out.println(entry.getFilename());
            }*/
            return sftp;
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    private static void closeChannel(Channel channel) {
        if (channel != null) {
            if (channel.isConnected()) {
                channel.disconnect();
            }
        }
    }

    private static void closeSession(Session session) {
        if (session != null) {
            if (session.isConnected()) {
                session.disconnect();
            }
        }
    }

    public String formPath(String absPath)
    {
        return this.DefaultPath+absPath;
    }
}
