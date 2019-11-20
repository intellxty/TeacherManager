package com.bdap.teachermanager.web.rest.newcode;

import com.bdap.teachermanager.security.AuthoritiesConstants;
import com.bdap.teachermanager.service.UserService;
import com.bdap.teachermanager.service.dto.UserDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;

import javax.servlet.http.HttpServletRequest;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.Reader;
import java.util.HashSet;
import java.util.Set;

/**
 * @Author XingTianYu
 * @date 2019/11/19 18:15
 */
@RestController
public class addUserFromFile {
    @Autowired
    UserService userService;
    @PostMapping("/addUserFromFile")
    public void addUserFromFile(HttpServletRequest request) throws IOException
    {

        MultipartHttpServletRequest multipartRequest = (MultipartHttpServletRequest) request;
        MultipartFile file = multipartRequest.getFile("file");
        String[] splits = file.getOriginalFilename().split("\\.");
        String fileType = splits[splits.length - 1];
        if(fileType.equals("csv"))
        {
            Reader reader =new InputStreamReader(file.getInputStream(), "utf-8");
            BufferedReader br = new BufferedReader(reader);

            String line;
            while ((line = br.readLine()) != null) {
                if(line.split(",").length!=2) {
                    return;
                }
                else {
                    Set<String> authorities=new HashSet<>();
                    authorities.add("ROLE_USER");
                    UserDTO newUser = new UserDTO();
                    String[] linedata=line.split(",");
                    newUser.setLogin(linedata[0]);
                    newUser.setPassWord(linedata[1]);
                    newUser.setAuthorities(authorities);
                    userService.createUser(newUser);
                }
            }
        }

        else if (fileType=="xls")
        {

        }
        else
        {

        }
    }
}
