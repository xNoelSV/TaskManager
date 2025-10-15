package com.xnoelsv.taskservice.configuration;

import lombok.Data;
import org.springframework.security.core.Authentication;

@Data
public class GatewayAuthentication implements Authentication {
    private final String userId;
    private final String username;
    private final String authorities;
    private boolean authenticated = true;

    @Override
    public String getName() { return username; }

    @Override
    public Long getCredentials() { return Long.parseLong(userId); }

    @Override
    public Object getDetails() { return null; }

    @Override
    public Object getPrincipal() { return this; }
}
