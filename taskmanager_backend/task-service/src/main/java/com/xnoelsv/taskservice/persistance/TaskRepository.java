package com.xnoelsv.taskservice.persistance;

import com.xnoelsv.taskservice.domain.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {
    List<Task> findByCreatedById(Long createdById);
    Optional<Task> findByIdAndCreatedById(Long id, Long createdById);
}
