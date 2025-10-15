package com.xnoelsv.taskservice.configuration;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

public class GatewayHeaderAuthFilter extends OncePerRequestFilter {

    @Override
    protected void doFilterInternal(HttpServletRequest req, HttpServletResponse res, FilterChain chain)
            throws ServletException, IOException {

        String userId = req.getHeader("X-User-Id");
        if (userId == null || userId.isBlank()) {
            res.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Missing identity from gateway");
            return;
        }
        String username = req.getHeader("X-Username");
        if (username == null || username.isBlank()) {
            res.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Missing username from gateway");
            return;
        }
        String roles = req.getHeader("X-Roles");
        if (roles == null || roles.isBlank()) {
            res.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Missing roles from gateway");
            return;
        }

        SecurityContextHolder.getContext().setAuthentication(new GatewayAuthentication(userId, username, roles));
        chain.doFilter(req, res);
    }
}
