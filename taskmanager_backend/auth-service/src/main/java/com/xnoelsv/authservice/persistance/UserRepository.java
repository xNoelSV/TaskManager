package com.xnoelsv.authservice.persistance;

import com.xnoelsv.authservice.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByUsername(String username);

    Optional<User> findByEmail(String email);

    @Query("select u from User u where u.username = :key or u.email = :key")
    Optional<User> findByUsernameOrEmail(@Param("key") String key);

    boolean existsByUsername(String username);

    boolean existsByEmail(String email);
}
