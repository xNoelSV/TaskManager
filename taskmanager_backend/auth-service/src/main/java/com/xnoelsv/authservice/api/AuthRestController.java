package com.xnoelsv.authservice.api;

import com.xnoelsv.authservice.application.UserService;
import com.xnoelsv.authservice.application.dto.LoginReq;
import com.xnoelsv.authservice.application.dto.MeRes;
import com.xnoelsv.authservice.application.dto.RegisterReq;
import com.xnoelsv.authservice.application.dto.TokenRes;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@AllArgsConstructor
public class AuthRestController {

    private final UserService userService;

    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    public MeRes register(@RequestBody RegisterReq req) {
        return userService.register(req);
    }

    @PostMapping("/login")
    public TokenRes login(@RequestBody LoginReq req) {
        return userService.login(req);
    }

//    @GetMapping("/me")
//    public MeRes me(@RequestHeader("Authorization") String authz) {
//        return userService.me(authz);
//    }

}
