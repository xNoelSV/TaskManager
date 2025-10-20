package com.xnoelsv.taskservice.utils;

import java.util.Optional;

import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;

public final class SecurityUtils {
    private SecurityUtils() {}

    // Get the current authenticated user's ID as a Long, if available.
    // Does not throw an exception.
    public static Optional<Long> getCurrentUserId() {
        Authentication auth = getAuth();
        if (auth == null || !auth.isAuthenticated()) return Optional.empty();

        // Typical case: JWT-based authentication
        if (auth instanceof JwtAuthenticationToken token) {
            Jwt jwt = token.getToken();

            // 1) "sub" (many issuers use it as ID)
            Long fromSub = toLong(jwt.getClaim("sub"));
            if (fromSub != null) return Optional.of(fromSub);

            // 2) other common claims in custom setups
            Long fromUserId = toLong(jwt.getClaim("user_id"));
            if (fromUserId != null) return Optional.of(fromUserId);

            Long fromUid = toLong(jwt.getClaim("uid"));
            if (fromUid != null) return Optional.of(fromUid);

            Long fromId = toLong(jwt.getClaim("id"));
            if (fromId != null) return Optional.of(fromId);
        }

        // Fallback: tries to parse the principal name
        Long fromName = toLong(auth.getName());
        return Optional.ofNullable(fromName);
    }

    // Same as above, but throws if no user is authenticated. Used in Services.
    public static Long requireUserId() {
        return getCurrentUserId()
                .orElseThrow(() -> new AccessDeniedException("No authenticated user"));
    }

    private static Authentication getAuth() {
        var ctx = SecurityContextHolder.getContext();
        return (ctx != null) ? ctx.getAuthentication() : null;
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
