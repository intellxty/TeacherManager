package com.bdap.teachermanager.repository.search;
import com.bdap.teachermanager.domain.Homework;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

/**
 * Spring Data Elasticsearch repository for the {@link Homework} entity.
 */
public interface HomeworkSearchRepository extends ElasticsearchRepository<Homework, String> {
}
