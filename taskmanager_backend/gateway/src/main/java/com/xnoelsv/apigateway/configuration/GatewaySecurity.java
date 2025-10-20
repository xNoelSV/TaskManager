package com.xnoelsv.apigateway.configuration;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.web.server.ServerHttpSecurity;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.NimbusReactiveJwtDecoder;
import org.springframework.security.oauth2.jwt.ReactiveJwtDecoder;
import org.springframework.security.web.server.SecurityWebFilterChain;

import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;

@Configuration
public class GatewaySecurity {

    @Bean
    public ReactiveJwtDecoder jwtDecoder(@Value("${JWT_SECRET:}") String secret) {
        // If it is a plain string, we can use it directly
        SecretKey key = new SecretKeySpec(secret.getBytes(StandardCharsets.UTF_8), "HmacSHA256");

        return NimbusReactiveJwtDecoder
                .withSecretKey(key)
                .macAlgorithm(MacAlgorithm.HS256) // Specify the algorithm
                .build();
    }

    @Bean
    SecurityWebFilterChain springSecurity(ServerHttpSecurity http) {
        return http
                .csrf(ServerHttpSecurity.CsrfSpec::disable)
                .authorizeExchange(reg -> reg
                        // Routes that don't require authentication'
                        .pathMatchers(
                                "/auth/register",
                                "/auth/login"
                        ).permitAll()
                        // Routes that require authentication
                        .anyExchange().authenticated()
                )
                .oauth2ResourceServer(oauth -> oauth.jwt(jwt -> {
                    // No additional configuration needed here since we have jwtDecoder() bean
                    // but this lambda avoids the deprecated no-arg method.
                }))
                .build();
    }
}
