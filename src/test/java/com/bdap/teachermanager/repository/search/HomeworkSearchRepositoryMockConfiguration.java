package com.bdap.teachermanager.repository.search;

import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Configuration;

/**
 * Configure a Mock version of {@link HomeworkSearchRepository} to test the
 * application without starting Elasticsearch.
 */
@Configuration
public class HomeworkSearchRepositoryMockConfiguration {

    @MockBean
    private HomeworkSearchRepository mockHomeworkSearchRepository;

}
