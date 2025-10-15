package com.xnoelsv.authservice.mapper;

import com.xnoelsv.authservice.application.dto.MeRes;
import com.xnoelsv.authservice.application.dto.TokenRes;
import com.xnoelsv.authservice.domain.User;
import org.springframework.stereotype.Component;

@Component
public class UserMapper {

    public MeRes toMeRes(User user) {
        return new MeRes(
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                user.getRoles()
        );
    }

    public TokenRes toTokenRes(String access, long expires) {
        return new TokenRes(
                access,
                expires,
                "Bearer"
        );
    }
}
