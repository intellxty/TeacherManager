package com.bdap.teachermanager.domain;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Field;
import org.springframework.data.mongodb.core.mapping.Document;
import javax.validation.constraints.*;

import org.springframework.data.elasticsearch.annotations.FieldType;
import java.io.Serializable;
import java.time.ZonedDateTime;

/**
 * A Homework.
 */
@Document(collection = "homework")
@org.springframework.data.elasticsearch.annotations.Document(indexName = "homework")
public class Homework implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @org.springframework.data.elasticsearch.annotations.Field(type = FieldType.Keyword)
    private String id;

    @NotNull
    @Field("file_name")
    private String fileName;

    @Field("last_edit_time")
    private ZonedDateTime lastEditTime;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getFileName() {
        return fileName;
    }

    public Homework fileName(String fileName) {
        this.fileName = fileName;
        return this;
    }

    public void setFileName(String fileName) {
        this.fileName = fileName;
    }

    public ZonedDateTime getLastEditTime() {
        return lastEditTime;
    }

    public Homework lastEditTime(ZonedDateTime lastEditTime) {
        this.lastEditTime = lastEditTime;
        return this;
    }

    public void setLastEditTime(ZonedDateTime lastEditTime) {
        this.lastEditTime = lastEditTime;
    }
    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here, do not remove

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Homework)) {
            return false;
        }
        return id != null && id.equals(((Homework) o).id);
    }

    @Override
    public int hashCode() {
        return 31;
    }

    @Override
    public String toString() {
        return "Homework{" +
            "id=" + getId() +
            ", fileName='" + getFileName() + "'" +
            ", lastEditTime='" + getLastEditTime() + "'" +
            "}";
    }
}
