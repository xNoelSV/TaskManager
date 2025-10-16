package com.xnoelsv.taskservice.configuration;

import lombok.Data;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;

import java.util.Collection;

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

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() { return null; }
}
