package com.xnoelsv.taskservice.application.dto;

public record TaskDTO (
        Long id,
        String title,
        String description,
        String status,
        Long createdById,
        Long updatedById,
        String createdAt,
        String updatedAt
) {
}
