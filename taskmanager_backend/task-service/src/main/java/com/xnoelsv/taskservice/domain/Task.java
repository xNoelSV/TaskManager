package com.xnoelsv.taskservice.domain;

import com.xnoelsv.taskservice.application.dto.TaskDTO;
import com.xnoelsv.taskservice.utils.SecurityUtils;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedBy;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedBy;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.Instant;

@Entity
@Data
@EntityListeners(AuditingEntityListener.class)
public class Task {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Title is mandatory")
    @Column(nullable = false)
    private String title;

    @NotBlank(message = "Description is mandatory")
    @Column(length = 4000)
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EStatus status = EStatus.TODO;

    @CreatedBy
    @Column(updatable = false)
    private Long createdById;

    @LastModifiedBy
    private Long updatedById;

    @CreatedDate
    @Column(updatable = false)
    private Instant createdAt;

    @LastModifiedDate
    private Instant updatedAt;

    protected Task() {
    }

    public Task(String title, String description, EStatus status) {
        this.title = title;
        this.description = description;
        if (status != null) this.status = status;
    }

    public Task update(TaskDTO patch) {
        if (patch.title() != null && !patch.title().isBlank()) this.title = patch.title();
        if (patch.description() != null && !patch.description().isBlank()) this.description = patch.description();
        if (patch.status() != null && !patch.status().isBlank()) this.status = EStatus.valueOf(patch.status());
        return this;
    }
}
