package com.xnoelsv.authservice.application.dto;

public record MeRes(
        Long id,
        String username,
        String email,
        String roles
) {
}
