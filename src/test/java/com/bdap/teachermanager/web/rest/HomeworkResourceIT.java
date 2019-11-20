package com.bdap.teachermanager.web.rest;

import com.bdap.teachermanager.TeachermanagerApp;
import com.bdap.teachermanager.domain.Homework;
import com.bdap.teachermanager.repository.HomeworkRepository;
import com.bdap.teachermanager.repository.search.HomeworkSearchRepository;
import com.bdap.teachermanager.service.HomeworkService;
import com.bdap.teachermanager.web.rest.errors.ExceptionTranslator;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.web.PageableHandlerMethodArgumentResolver;
import org.springframework.http.MediaType;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.validation.Validator;


import java.time.Instant;
import java.time.ZonedDateTime;
import java.time.ZoneOffset;
import java.time.ZoneId;
import java.util.Collections;
import java.util.List;

import static com.bdap.teachermanager.web.rest.TestUtil.sameInstant;
import static com.bdap.teachermanager.web.rest.TestUtil.createFormattingConversionService;
import static org.assertj.core.api.Assertions.assertThat;
import static org.elasticsearch.index.query.QueryBuilders.queryStringQuery;
import static org.hamcrest.Matchers.hasItem;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Integration tests for the {@link HomeworkResource} REST controller.
 */
@SpringBootTest(classes = TeachermanagerApp.class)
public class HomeworkResourceIT {

    private static final String DEFAULT_FILE_NAME = "AAAAAAAAAA";
    private static final String UPDATED_FILE_NAME = "BBBBBBBBBB";

    private static final ZonedDateTime DEFAULT_LAST_EDIT_TIME = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_LAST_EDIT_TIME = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    @Autowired
    private HomeworkRepository homeworkRepository;

    @Autowired
    private HomeworkService homeworkService;

    /**
     * This repository is mocked in the com.bdap.teachermanager.repository.search test package.
     *
     * @see com.bdap.teachermanager.repository.search.HomeworkSearchRepositoryMockConfiguration
     */
    @Autowired
    private HomeworkSearchRepository mockHomeworkSearchRepository;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    @Autowired
    private Validator validator;

    private MockMvc restHomeworkMockMvc;

    private Homework homework;

    @BeforeEach
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final HomeworkResource homeworkResource = new HomeworkResource(homeworkService);
        this.restHomeworkMockMvc = MockMvcBuilders.standaloneSetup(homeworkResource)
            .setCustomArgumentResolvers(pageableArgumentResolver)
            .setControllerAdvice(exceptionTranslator)
            .setConversionService(createFormattingConversionService())
            .setMessageConverters(jacksonMessageConverter)
            .setValidator(validator).build();
    }

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Homework createEntity() {
        Homework homework = new Homework()
            .fileName(DEFAULT_FILE_NAME)
            .lastEditTime(DEFAULT_LAST_EDIT_TIME);
        return homework;
    }
    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Homework createUpdatedEntity() {
        Homework homework = new Homework()
            .fileName(UPDATED_FILE_NAME)
            .lastEditTime(UPDATED_LAST_EDIT_TIME);
        return homework;
    }

    @BeforeEach
    public void initTest() {
        homeworkRepository.deleteAll();
        homework = createEntity();
    }

    @Test
    public void createHomework() throws Exception {
        int databaseSizeBeforeCreate = homeworkRepository.findAll().size();

        // Create the Homework
        restHomeworkMockMvc.perform(post("/api/homework")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(homework)))
            .andExpect(status().isCreated());

        // Validate the Homework in the database
        List<Homework> homeworkList = homeworkRepository.findAll();
        assertThat(homeworkList).hasSize(databaseSizeBeforeCreate + 1);
        Homework testHomework = homeworkList.get(homeworkList.size() - 1);
        assertThat(testHomework.getFileName()).isEqualTo(DEFAULT_FILE_NAME);
        assertThat(testHomework.getLastEditTime()).isEqualTo(DEFAULT_LAST_EDIT_TIME);

        // Validate the Homework in Elasticsearch
        verify(mockHomeworkSearchRepository, times(1)).save(testHomework);
    }

    @Test
    public void createHomeworkWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = homeworkRepository.findAll().size();

        // Create the Homework with an existing ID
        homework.setId("existing_id");

        // An entity with an existing ID cannot be created, so this API call must fail
        restHomeworkMockMvc.perform(post("/api/homework")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(homework)))
            .andExpect(status().isBadRequest());

        // Validate the Homework in the database
        List<Homework> homeworkList = homeworkRepository.findAll();
        assertThat(homeworkList).hasSize(databaseSizeBeforeCreate);

        // Validate the Homework in Elasticsearch
        verify(mockHomeworkSearchRepository, times(0)).save(homework);
    }


    @Test
    public void checkFileNameIsRequired() throws Exception {
        int databaseSizeBeforeTest = homeworkRepository.findAll().size();
        // set the field null
        homework.setFileName(null);

        // Create the Homework, which fails.

        restHomeworkMockMvc.perform(post("/api/homework")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(homework)))
            .andExpect(status().isBadRequest());

        List<Homework> homeworkList = homeworkRepository.findAll();
        assertThat(homeworkList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    public void getAllHomework() throws Exception {
        // Initialize the database
        homeworkRepository.save(homework);

        // Get all the homeworkList
        restHomeworkMockMvc.perform(get("/api/homework?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(homework.getId())))
            .andExpect(jsonPath("$.[*].fileName").value(hasItem(DEFAULT_FILE_NAME)))
            .andExpect(jsonPath("$.[*].lastEditTime").value(hasItem(sameInstant(DEFAULT_LAST_EDIT_TIME))));
    }
    
    @Test
    public void getHomework() throws Exception {
        // Initialize the database
        homeworkRepository.save(homework);

        // Get the homework
        restHomeworkMockMvc.perform(get("/api/homework/{id}", homework.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(homework.getId()))
            .andExpect(jsonPath("$.fileName").value(DEFAULT_FILE_NAME))
            .andExpect(jsonPath("$.lastEditTime").value(sameInstant(DEFAULT_LAST_EDIT_TIME)));
    }

    @Test
    public void getNonExistingHomework() throws Exception {
        // Get the homework
        restHomeworkMockMvc.perform(get("/api/homework/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    public void updateHomework() throws Exception {
        // Initialize the database
        homeworkService.save(homework);
        // As the test used the service layer, reset the Elasticsearch mock repository
        reset(mockHomeworkSearchRepository);

        int databaseSizeBeforeUpdate = homeworkRepository.findAll().size();

        // Update the homework
        Homework updatedHomework = homeworkRepository.findById(homework.getId()).get();
        updatedHomework
            .fileName(UPDATED_FILE_NAME)
            .lastEditTime(UPDATED_LAST_EDIT_TIME);

        restHomeworkMockMvc.perform(put("/api/homework")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedHomework)))
            .andExpect(status().isOk());

        // Validate the Homework in the database
        List<Homework> homeworkList = homeworkRepository.findAll();
        assertThat(homeworkList).hasSize(databaseSizeBeforeUpdate);
        Homework testHomework = homeworkList.get(homeworkList.size() - 1);
        assertThat(testHomework.getFileName()).isEqualTo(UPDATED_FILE_NAME);
        assertThat(testHomework.getLastEditTime()).isEqualTo(UPDATED_LAST_EDIT_TIME);

        // Validate the Homework in Elasticsearch
        verify(mockHomeworkSearchRepository, times(1)).save(testHomework);
    }

    @Test
    public void updateNonExistingHomework() throws Exception {
        int databaseSizeBeforeUpdate = homeworkRepository.findAll().size();

        // Create the Homework

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restHomeworkMockMvc.perform(put("/api/homework")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(homework)))
            .andExpect(status().isBadRequest());

        // Validate the Homework in the database
        List<Homework> homeworkList = homeworkRepository.findAll();
        assertThat(homeworkList).hasSize(databaseSizeBeforeUpdate);

        // Validate the Homework in Elasticsearch
        verify(mockHomeworkSearchRepository, times(0)).save(homework);
    }

    @Test
    public void deleteHomework() throws Exception {
        // Initialize the database
        homeworkService.save(homework);

        int databaseSizeBeforeDelete = homeworkRepository.findAll().size();

        // Delete the homework
        restHomeworkMockMvc.perform(delete("/api/homework/{id}", homework.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Homework> homeworkList = homeworkRepository.findAll();
        assertThat(homeworkList).hasSize(databaseSizeBeforeDelete - 1);

        // Validate the Homework in Elasticsearch
        verify(mockHomeworkSearchRepository, times(1)).deleteById(homework.getId());
    }

    @Test
    public void searchHomework() throws Exception {
        // Initialize the database
        homeworkService.save(homework);
        when(mockHomeworkSearchRepository.search(queryStringQuery("id:" + homework.getId()), PageRequest.of(0, 20)))
            .thenReturn(new PageImpl<>(Collections.singletonList(homework), PageRequest.of(0, 1), 1));
        // Search the homework
        restHomeworkMockMvc.perform(get("/api/_search/homework?query=id:" + homework.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(homework.getId())))
            .andExpect(jsonPath("$.[*].fileName").value(hasItem(DEFAULT_FILE_NAME)))
            .andExpect(jsonPath("$.[*].lastEditTime").value(hasItem(sameInstant(DEFAULT_LAST_EDIT_TIME))));
    }
}
