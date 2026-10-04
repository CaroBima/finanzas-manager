package org.cbpersonalproject.controller;

import lombok.RequiredArgsConstructor;
import org.cbpersonalproject.service.TokenBlocklistService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Mono;

import java.time.Instant;
import java.time.temporal.ChronoUnit;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final TokenBlocklistService tokenBlocklistService;

    @PostMapping("/logout")
    public Mono<ResponseEntity<Void>> logout(@AuthenticationPrincipal Mono<Jwt> jwtMono) {
        return jwtMono.flatMap(jwt -> {
            long ttl = ChronoUnit.SECONDS.between(Instant.now(), jwt.getExpiresAt());
            if (ttl <= 0) {
                return Mono.just(ResponseEntity.noContent().<Void>build());
            }
            return tokenBlocklistService.block(jwt.getTokenValue(), ttl)
                    .thenReturn(ResponseEntity.noContent().<Void>build());
        });
    }
}
