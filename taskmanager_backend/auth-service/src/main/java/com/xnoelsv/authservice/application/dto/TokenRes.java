package com.xnoelsv.authservice.application.dto;

public record TokenRes(
        String access_token,
        long expires_in,
        String token_type
) {
}
