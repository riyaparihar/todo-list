package com.todo.entity;

import javax.persistence.*;
import java.io.Serializable;

@Entity
public class Todo  implements Serializable {
    @Id
    private Integer id;
    private String task;
    private Integer priority;

    public Todo(Integer id, String task, Integer priority) {
        this.id = id;
        this.task = task;
        this.priority = priority;
    }

    public Integer getId() {
        return id;
    }

    public Integer getPriority() {
        return priority;
    }

    public String getTask() {
        return task;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public void setPriority(Integer priority) {
        this.priority = priority;
    }

    public void setTask(String task) {
        this.task = task;
    }

    public Todo() {
    }


}
