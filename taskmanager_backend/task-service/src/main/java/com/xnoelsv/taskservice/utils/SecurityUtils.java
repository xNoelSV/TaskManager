package com.xnoelsv.taskservice.utils;

import java.util.Optional;

import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;

public final class SecurityUtils {
    private SecurityUtils() {}

    public static Optional<Long> getCurrentUserId() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated()) return Optional.empty();

        // 1) If you come with JWT (when the service validates the token directly)
        if (auth instanceof JwtAuthenticationToken jwtAuth) {
            Jwt jwt = jwtAuth.getToken();
            // "subject" is the userId in your auth-service (setSubject(String.valueOf(userId)))
            Long fromSub = toLong(jwt.getSubject());
            // if any day you add "userId" claim
            Long fromClaim = toLong(jwt.getClaim("userId"));
            return Optional.ofNullable(fromClaim != null ? fromClaim : fromSub);
        }

        // 2) If you come from the gateway with our custom authentication
        // (GatewayHeaderAuthFilter puts Authentication with userId in credentials)
        Long fromCreds = toLong(auth.getCredentials());
        if (fromCreds != null) return Optional.of(fromCreds);

        // 3) Last try: check the principal if it exposes a userId field
        Object principal = auth.getPrincipal();
        Long fromPrincipal = toLong(principal);
        if (fromPrincipal != null) return Optional.of(fromPrincipal);

        try {
            var f = principal.getClass().getDeclaredField("userId");
            f.setAccessible(true);
            Long fromField = toLong(f.get(principal));
            if (fromField != null) return Optional.of(fromField);
        } catch (Exception ignored) {}

        return Optional.empty();
    }

    public static Long requireUserId() {
        return getCurrentUserId().orElseThrow(
                () -> new AccessDeniedException("User ID missing in authentication")
        );
    }

    // Parse numbers/strings to Long safely. Returns null if not possible.
    private static Long toLong(Object value) {
        if (value == null) return null;
        if (value instanceof Long l) return l;
        if (value instanceof Integer i) return i.longValue();
        if (value instanceof Number n) return n.longValue();
        if (value instanceof String s) {
            try { return Long.parseLong(s.trim()); } catch (NumberFormatException ignored) {}
        }
        return null;
    }
}
