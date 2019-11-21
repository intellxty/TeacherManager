package com.bdap.teachermanager.domain;

import org.junit.jupiter.api.Test;
import static org.assertj.core.api.Assertions.assertThat;
import com.bdap.teachermanager.web.rest.TestUtil;

public class HomeworkTest {

    @Test
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Homework.class);
        Homework homework1 = new Homework();
        homework1.setId("id1");
        Homework homework2 = new Homework();
        homework2.setId(homework1.getId());
        assertThat(homework1).isEqualTo(homework2);
        homework2.setId("id2");
        assertThat(homework1).isNotEqualTo(homework2);
        homework1.setId(null);
        assertThat(homework1).isNotEqualTo(homework2);
    }
}
