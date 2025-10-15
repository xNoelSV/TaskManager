package com.xnoelsv.taskservice.utils;

import com.xnoelsv.taskservice.configuration.GatewayAuthentication;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

@Component
public class SecurityUtils {
    public static GatewayAuthentication getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof GatewayAuthentication) {
            return (GatewayAuthentication) authentication.getPrincipal();
        }
        throw new RuntimeException("No authenticated user found");
    }

    public static Long getCurrentUserId() {
        return getCurrentUser().getCredentials();
    }

    public static String getCurrentUserName() {
        return getCurrentUser().getName();
    }

}
