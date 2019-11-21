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

    @NotNull
    @Field("owner")
    private String owner;

    @NotNull
    @Field("class_name")
    private String className;

    @NotNull
    @Field("edit_time")
    private ZonedDateTime editTime;

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

    public String getOwner() {
        return owner;
    }

    public Homework owner(String owner) {
        this.owner = owner;
        return this;
    }

    public void setOwner(String owner) {
        this.owner = owner;
    }

    public String getClassName() {
        return className;
    }

    public Homework className(String className) {
        this.className = className;
        return this;
    }

    public void setClassName(String className) {
        this.className = className;
    }

    public ZonedDateTime getEditTime() {
        return editTime;
    }

    public Homework editTime(ZonedDateTime editTime) {
        this.editTime = editTime;
        return this;
    }

    public void setEditTime(ZonedDateTime editTime) {
        this.editTime = editTime;
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
            ", owner='" + getOwner() + "'" +
            ", className='" + getClassName() + "'" +
            ", editTime='" + getEditTime() + "'" +
            "}";
    }
}
