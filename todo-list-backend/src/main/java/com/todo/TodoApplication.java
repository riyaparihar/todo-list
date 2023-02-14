package com.todo;

import com.todo.entity.Todo;
import com.todo.repository.TodoRepository;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@SpringBootApplication
@EnableJpaRepositories
@EntityScan
@RestController
@RequestMapping("/todo/")
public class TodoApplication {
    private  final TodoRepository todoRepository;

    public TodoApplication(TodoRepository todoRepository) {
        this.todoRepository=todoRepository;
    }
    public static void main(String[] args) {

        System.setProperty("user.timezone", "UTC");
        SpringApplication.run(TodoApplication.class, args);
    }

    @GetMapping("list")
    public List<Todo> getTodoList(@RequestParam(defaultValue = "") String search){
        if(search==""){
            return this.todoRepository.findAll();
        }
        return this.todoRepository.findByTaskContaining(search);

    }

    @DeleteMapping("{taskId}")
    public void deleteTodo(@PathVariable("taskId") Integer id){
        this.todoRepository.deleteById(id);
    }


}
