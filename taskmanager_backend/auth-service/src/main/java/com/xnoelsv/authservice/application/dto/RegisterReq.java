package com.xnoelsv.authservice.application.dto;

public record RegisterReq(
        String username,
        String email,
        String password
) {
}
