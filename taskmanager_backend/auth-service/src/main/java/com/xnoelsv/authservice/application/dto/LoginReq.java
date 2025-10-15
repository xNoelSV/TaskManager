package com.xnoelsv.authservice.application.dto;

public record LoginReq (
        String usernameOrEmail,
        String password
) {
}
