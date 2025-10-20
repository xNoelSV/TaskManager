package com.xnoelsv.taskservice.configuration;

import java.util.Optional;

import com.xnoelsv.taskservice.utils.SecurityUtils;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.domain.AuditorAware;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@Configuration
@EnableJpaAuditing(auditorAwareRef = "auditorAware")
public class JpaConfig {

    @Bean
    public AuditorAware<Long> auditorAware() {
        return () -> {
            Optional<Long> userId = SecurityUtils.getCurrentUserId();
            return userId;
        };
    }
}
