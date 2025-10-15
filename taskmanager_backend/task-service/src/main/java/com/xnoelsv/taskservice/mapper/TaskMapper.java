package com.xnoelsv.taskservice.mapper;

import com.xnoelsv.taskservice.application.dto.TaskDTO;
import com.xnoelsv.taskservice.domain.Task;
import org.springframework.stereotype.Component;

@Component
public class TaskMapper {

    public String mapStatus(String status) {
        return switch (status.toUpperCase()) {
            case "TODO" -> "To Do";
            case "IN_PROGRESS" -> "In Progress";
            case "DONE" -> "Done";
            case "CANCELLED" -> "Cancelled";
            default -> "Unknown";
        };
    }

    public Task toEntity(TaskDTO taskDTO) {
        return new Task(taskDTO.title(), taskDTO.description(), taskDTO.status());
    }

    public TaskDTO toDTO(Task task) {
        return new TaskDTO(
                task.getId(),
                task.getUserId(),
                task.getTitle(),
                task.getDescription(),
                mapStatus(task.getStatus().name())
        );
    }

}
