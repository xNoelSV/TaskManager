package com.xnoelsv.taskservice.application.dto;

public record TaskDTO (
        Long id,
        Long userId,
        String title,
        String description,
        String status
) {
}
