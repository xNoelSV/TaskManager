package com.xnoelsv.taskservice.api;

import com.xnoelsv.taskservice.application.TaskService;
import com.xnoelsv.taskservice.application.dto.TaskDTO;
import com.xnoelsv.taskservice.domain.Task;
import jakarta.servlet.http.HttpServletRequest;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/tasks")
@AllArgsConstructor
public class TaskController {

    private TaskService taskService;

    @GetMapping
    public List<TaskDTO> getAll(){
        return taskService.getAll();
    }

    @PostMapping
    public TaskDTO create(@RequestBody TaskDTO task){
        return taskService.create(task);
    }

    @GetMapping("/{id}")
    public TaskDTO getOne(@PathVariable Long id){
        return taskService.getById(id);
    }

    @PutMapping("/{id}")
    public TaskDTO update(@PathVariable Long id, @RequestBody TaskDTO patch){
        return taskService.update(id, patch);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id){
        taskService.delete(id);
    }

}
