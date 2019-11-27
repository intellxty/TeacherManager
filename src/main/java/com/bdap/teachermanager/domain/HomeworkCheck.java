package com.bdap.teachermanager.domain;

import lombok.AllArgsConstructor;

/**
 * @Author XingTianYu
 * @date 2019/11/27 17:50
 */
public class HomeworkCheck {
    String owner;
    String iscomplete;

    public String getOwner() {
        return owner;
    }

    public void setOwner(String owner) {
        this.owner = owner;
    }

    public String getIscomplete() {
        return iscomplete;
    }

    public void setIscomplete(String iscomplete) {
        this.iscomplete = iscomplete;
    }
}
