package com.xnoelsv.authservice.application;

import com.xnoelsv.authservice.application.dto.LoginReq;
import com.xnoelsv.authservice.application.dto.MeRes;
import com.xnoelsv.authservice.application.dto.RegisterReq;
import com.xnoelsv.authservice.application.dto.TokenRes;
import com.xnoelsv.authservice.domain.User;
import com.xnoelsv.authservice.mapper.UserMapper;
import com.xnoelsv.authservice.persistance.UserRepository;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.web.server.ResponseStatusException;

import java.nio.charset.StandardCharsets;
import java.time.Duration;

@Service
@AllArgsConstructor
public class UserService {

    private UserRepository users;
    private PasswordEncoder encoder;
    private final JwtService jwtService;
    private UserMapper mapper;

    public MeRes register(RegisterReq req) {
        if (users.existsByUsername(req.username())) throw new ResponseStatusException(HttpStatus.CONFLICT, "Username in use");
        if (users.existsByEmail(req.email())) throw new ResponseStatusException(HttpStatus.CONFLICT, "Email in use");

        User u = new User();
        u.setUsername(req.username());
        u.setEmail(req.email());
        u.setPasswordHash(encoder.encode(req.password()));
        u = users.save(u);

        return mapper.toMeRes(u);
    }

    public TokenRes login(LoginReq req) {
        User u = users.findByUsernameOrEmail(req.usernameOrEmail())
                .filter(x -> encoder.matches(req.password(), x.getPasswordHash()))
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Credentials are invalid"));

        String access = jwtService.createAccessToken(u.getId(), u.getUsername(), u.getRoles());
        long expires = Duration.ofMinutes(15).toSeconds();

        return mapper.toTokenRes(access, expires);
    }

    public MeRes me(String authz) {
        // API Gateway won't use this endpoint, it's only for testing purposes
        if (!authz.startsWith("Bearer ")) throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Malformed Authorization header");
        String token = authz.replace("Bearer ","").trim();
        Claims c = Jwts.parserBuilder()
                .setSigningKey(Keys.hmacShaKeyFor(
                        ((String) ReflectionTestUtils.getField(jwtService, "secret")).getBytes(StandardCharsets.UTF_8)))
                .requireIssuer(((String) ReflectionTestUtils.getField(jwtService, "issuer")))
                .build()
                .parseClaimsJws(token).getBody();

        Long id = Long.valueOf(c.getSubject());
        User u = users.findById(id).orElseThrow();
        return mapper.toMeRes(u);
    }
}
