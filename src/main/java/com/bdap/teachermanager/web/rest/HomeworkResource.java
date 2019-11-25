package com.bdap.teachermanager.web.rest;

import com.bdap.teachermanager.config.FtpConfiguration;
import com.bdap.teachermanager.domain.Homework;
import com.bdap.teachermanager.service.FtpService;
import com.bdap.teachermanager.service.HomeworkService;
import com.bdap.teachermanager.web.rest.errors.BadRequestAlertException;

import com.jcraft.jsch.ChannelSftp;
import io.github.jhipster.web.util.HeaderUtil;
import io.github.jhipster.web.util.PaginationUtil;
import io.github.jhipster.web.util.ResponseUtil;
import org.apache.commons.compress.utils.IOUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import javax.validation.Valid;
import java.io.InputStream;
import java.net.URI;
import java.net.URISyntaxException;

import java.net.URLEncoder;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;


/**
 * REST controller for managing {@link com.bdap.teachermanager.domain.Homework}.
 */
@RestController
@RequestMapping("/api")
public class HomeworkResource {

    private final Logger log = LoggerFactory.getLogger(HomeworkResource.class);

    private static final String ENTITY_NAME = "homework";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final HomeworkService homeworkService;

    @Autowired
    FtpService ftpService;

    FtpConfiguration ftpConfiguration=new FtpConfiguration();

    ChannelSftp sftp=ftpConfiguration.sftp;

    public HomeworkResource(HomeworkService homeworkService) {
        this.homeworkService = homeworkService;
    }

    /**
     * {@code POST  /homework} : Create a new homework.
     *
     * @param homework the homework to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new homework, or with status {@code 400 (Bad Request)} if the homework has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    //上传作业时将作业信息写入数据库
    @PostMapping("/homework")
    public ResponseEntity<Homework> createHomework(@RequestParam("owner") String owner ,@RequestParam("className") String className , @RequestParam("file") MultipartFile file) throws Exception {
        SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        Homework homework=new Homework(file.getOriginalFilename(),owner,className, df.format(new Date()));
        log.debug("REST request to save Homework : {}", homework);
        if (homework.getId() != null) {
            throw new BadRequestAlertException("A new homework cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Homework update=homeworkService.checkExistByFileNameAndOwner(homework);
        if(update!=null){

        }
        Homework result = homeworkService.save(homework);

        ftpService.uploadFiles(sftp,ftpConfiguration.DefaultPath+ftpConfiguration.homeWorkDir+"/"+homework.getClassName()+"/"+homework.getOwner()+"/"+homework.getFileName(),file);
        return ResponseEntity.created(new URI("/api/homework/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /homework} : Updates an existing homework.
     *
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated homework,
     * or with status {@code 400 (Bad Request)} if the homework is not valid,
     * or with status {@code 500 (Internal Server Error)} if the homework couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */

    @PutMapping("/homework")
    public ResponseEntity<Homework> updateHomework(@RequestParam("owner") String owner ,@RequestParam("className") String className , @RequestParam("file") MultipartFile file) throws Exception {
        SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
       Homework homework=new Homework(file.getOriginalFilename(),owner,className, df.format(new Date()));
        log.debug("REST request to update Homework : {}", homework);
        /*if (homework.getOwner() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }*/
         Homework update=homeworkService.checkExistByFileNameAndOwner(homework);
         if(update!=null) {
             homework.setId(update.getId());
         }
         Homework result = homeworkService.save(homework);
        ftpService.uploadFiles(sftp,ftpConfiguration.DefaultPath+ftpConfiguration.homeWorkDir+"/"+homework.getClassName()+"/"+homework.getOwner()+"/"+homework.getFileName(),file);
         return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, homework.getId().toString()))
            .body(result);
    }

    /**
     * {@code GET  /homework} : get all the homework.
     *

     * @param pageable the pagination information.

     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of homework in body.
     */
    @GetMapping("/homework")
    public ResponseEntity<List<Homework>> getAllHomework(Pageable pageable) {
        log.debug("REST request to get a page of Homework");
        Page<Homework> page = homeworkService.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());

    }
    @GetMapping("/homework/student/{owner}")
    public ResponseEntity<List<Homework>> getStudentHomework(@PathVariable String owner) {
        log.debug("REST request to get a page of Homework");
        List<Homework> homework = homeworkService.findByOwner(owner);
        return ResponseEntity.ok().body(homework);
    }

    /**
     * {@code GET  /homework/:id} : get the "id" homework.
     *
     * @param id the id of the homework to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the homework, or with status {@code 404 (Not Found)}.
     */
    /*@GetMapping("/homework/{id}")
    public ResponseEntity<Homework> getHomework(@PathVariable String id) {
        log.debug("REST request to get Homework : {}", id);
        Optional<Homework> homework = homeworkService.findOne(id);
        return ResponseUtil.wrapOrNotFound(homework);
    }*/

    /**
     * {@code DELETE  /homework/:id} : delete the "id" homework.
     *
     *
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/homework")
    public ResponseEntity<Void> deleteHomework(@RequestParam("owner") String owner ,@RequestParam("className") String className,@RequestParam("fileName") String fileName)throws  Exception
    { ;
        homeworkService.delete(fileName,owner,className);
        ftpService.deleteFiles(sftp,ftpConfiguration.DefaultPath+ftpConfiguration.homeWorkDir+"/"+className+"/"+owner+"/"+fileName);
        return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, owner)).build();
    }

    /**
     * {@code SEARCH  /_search/homework?query=:query} : search for the homework corresponding
     * to the query.
     *
     * @param query the query of the homework search.
     * @param pageable the pagination information.
     * @return the result of the search.
     */
    @GetMapping("/_search/homework")
    public ResponseEntity<List<Homework>> searchHomework(@RequestParam String query, Pageable pageable) {
        log.debug("REST request to search for a page of Homework for query {}", query);
        Page<Homework> page = homeworkService.search(query, pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }
    @GetMapping("/homework/download")
    Object downloadHomework(@RequestParam("owner") String owner ,@RequestParam("className") String className,@RequestParam("fileName") String fileName)throws Exception
    {
        HttpHeaders httpHeaders = new HttpHeaders();
        httpHeaders.add("Content-Disposition", "attachment;filename=" + URLEncoder.encode(fileName,"UTF-8"));
        InputStream stream=ftpService.downloadFiles(sftp,ftpConfiguration.DefaultPath+ftpConfiguration.homeWorkDir+"/"+className+"/"+owner+"/"+fileName);
        if(stream!=null) {
            byte[] body = IOUtils.toByteArray(stream);
            return ResponseEntity.ok().headers(httpHeaders)
                .contentType(MediaType.parseMediaType("application/octet-stream")).body(body);
        }
        else {return null;}
    }
}
