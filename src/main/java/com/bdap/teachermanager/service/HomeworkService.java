package com.bdap.teachermanager.service;

import com.bdap.teachermanager.domain.Homework;
import com.bdap.teachermanager.repository.HomeworkRepository;
import com.bdap.teachermanager.repository.search.HomeworkSearchRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import javax.jws.Oneway;
import java.util.List;
import java.util.Optional;

import static org.elasticsearch.index.query.QueryBuilders.*;

/**
 * Service Implementation for managing {@link Homework}.
 */
@Service
public class HomeworkService {

    private final Logger log = LoggerFactory.getLogger(HomeworkService.class);

    private final HomeworkRepository homeworkRepository;

    private final HomeworkSearchRepository homeworkSearchRepository;

    public HomeworkService(HomeworkRepository homeworkRepository, HomeworkSearchRepository homeworkSearchRepository) {
        this.homeworkRepository = homeworkRepository;
        this.homeworkSearchRepository = homeworkSearchRepository;
    }

    /**
     * Save a homework.
     *
     * @param homework the entity to save.
     * @return the persisted entity.
     */
    public Homework save(Homework homework) {
        log.debug("Request to save Homework : {}", homework);
        Homework result = homeworkRepository.save(homework);
        homeworkSearchRepository.save(result);
        return result;
    }

    /**
     * Get all the homework.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    public Page<Homework> findAll(Pageable pageable) {
        log.debug("Request to get all Homework");
        return homeworkRepository.findAll(pageable);
    }
    public List<Homework> findByOwner(String Owner)
    {
        log.debug("Request to get one student's Homework");
        return homeworkRepository.findByOwner(Owner);
    }

    /**
     * Get one homework by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    public Optional<Homework> findOne(String id) {
        log.debug("Request to get Homework : {}", id);
        return homeworkRepository.findById(id);
    }

    /**
     * Delete the homework by id.
     *
     * @param id the id of the entity.
     */
    public void delete(String id) {
        log.debug("Request to delete Homework : {}", id);
        homeworkRepository.deleteById(id);
        homeworkSearchRepository.deleteById(id);
    }

    /**
     * Search for the homework corresponding to the query.
     *
     * @param query the query of the search.
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    public Page<Homework> search(String query, Pageable pageable) {
        log.debug("Request to search for a page of Homework for query {}", query);
        return homeworkSearchRepository.search(queryStringQuery(query), pageable);    }
}
