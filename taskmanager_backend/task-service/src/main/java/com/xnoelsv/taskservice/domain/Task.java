package com.xnoelsv.taskservice.domain;

import com.xnoelsv.taskservice.application.dto.TaskDTO;
import com.xnoelsv.taskservice.utils.SecurityUtils;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Task {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long userId = SecurityUtils.getCurrentUser().getCredentials();

    @NotBlank(message = "Title is required")
    @Column(nullable = false)
    private String title;

    private String description;

    @NotBlank(message = "Status is required")
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EStatus status;

    public Task(String title, String description, String status) {
        this.title = title;
        this.description = description;
        if (status.isBlank()) this.status = EStatus.TODO;
        else this.status = EStatus.valueOf(status);
    }

    public Task update(TaskDTO patch) {
        if (patch.title() != null && !patch.title().isBlank()) this.title = patch.title();
        if (patch.description() != null && !patch.description().isBlank()) this.description = patch.description();
        if (patch.status() != null && !patch.status().isBlank()) this.status = EStatus.valueOf(patch.status());
        return this;
    }
}
