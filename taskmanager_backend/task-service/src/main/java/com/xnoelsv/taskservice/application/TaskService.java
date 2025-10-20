package com.xnoelsv.taskservice.application;

import com.xnoelsv.taskservice.application.dto.TaskDTO;
import com.xnoelsv.taskservice.domain.Task;
import com.xnoelsv.taskservice.mapper.TaskMapper;
import com.xnoelsv.taskservice.persistance.TaskRepository;
import com.xnoelsv.taskservice.utils.SecurityUtils;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
@AllArgsConstructor
public class TaskService {

    private TaskRepository taskRepository;
    private TaskMapper taskMapper;

    public List<TaskDTO> getAll() {
        List<Task> tasks = taskRepository.findByCreatedById(SecurityUtils.requireUserId());
        return tasks.stream()
                .map(taskMapper::toDTO)
                .toList();
    }

    public TaskDTO create(TaskDTO task) {
        Task t = taskMapper.toEntity(task);
        return taskMapper.toDTO(taskRepository.save(t));
    }

    public TaskDTO getById(Long id) {
        Task t = taskRepository.findByIdAndCreatedById(id, SecurityUtils.requireUserId())
                .orElseThrow(() -> new RuntimeException("Task not found"));
        return taskMapper.toDTO(t);
    }

    public TaskDTO update(Long id, TaskDTO patch) {
        Task t = taskRepository.findByIdAndCreatedById(id, SecurityUtils.requireUserId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        taskRepository.save(t.update(patch));
        return taskMapper.toDTO(t);
    }

    public void delete(Long id) {
        taskRepository.findByIdAndCreatedById(id, SecurityUtils.requireUserId())
                .ifPresent(taskRepository::delete);
    }
}
