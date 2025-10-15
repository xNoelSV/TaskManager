package com.xnoelsv.apigateway.security;

import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.core.Ordered;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.security.core.context.ReactiveSecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

import java.util.Collection;

@Component
public class InjectUserHeadersFilter implements GlobalFilter, Ordered {

    @Override
    public int getOrder() { return -1; } // Run before the security filter

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {

        // We will only inject headers if the user is authenticated
        return ReactiveSecurityContextHolder.getContext()
                .flatMap(ctx -> {
                    var auth = ctx.getAuthentication();
                    if (auth instanceof JwtAuthenticationToken jwtAuth) {
                        Jwt jwt = jwtAuth.getToken();
                        String userId = jwt.getSubject(); // "sub"
                        String username = jwt.getClaimAsString("username");
                        // "roles" can be a String or a Collection of Strings
                        Object rolesObj = jwt.getClaims().get("roles");
                        String roles = (rolesObj instanceof Collection<?> col)
                                ? String.join(",", col.stream().map(String::valueOf).toList())
                                : String.valueOf(rolesObj);

                        ServerHttpRequest mutated = exchange.getRequest().mutate()
                                .header("X-User-Id", userId)
                                .header("X-Username", username != null ? username : "")
                                .header("X-Roles", roles != null ? roles : "")
                                .build();

                        return chain.filter(exchange.mutate().request(mutated).build());
                    }
                    // If the user is not authenticated, we will continue the chain
                    return chain.filter(exchange);
                })
                .switchIfEmpty(chain.filter(exchange));
    }
}
