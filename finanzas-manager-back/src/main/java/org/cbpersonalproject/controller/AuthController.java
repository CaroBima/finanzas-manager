package org.cbpersonalproject.controller;

import com.nimbusds.jwt.JWTParser;
import lombok.RequiredArgsConstructor;
import org.cbpersonalproject.dto.LogoutResponse;
import org.cbpersonalproject.service.TokenBlocklistService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Mono;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.Date;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final TokenBlocklistService tokenBlocklistService;

    @Value("${keycloak.end-session-uri}")
    private String keycloakEndSessionUri;

    @Value("${app.frontend-url}")
    private String frontendUrl;

    @Value("${spring.security.oauth2.client.registration.keycloak.client-id}")
    private String clientId;

    @PostMapping("/logout")
    public Mono<ResponseEntity<LogoutResponse>> logout(
            @RequestHeader(value = HttpHeaders.AUTHORIZATION, required = false) String authHeader) {

        String redirectUri = URLEncoder.encode(frontendUrl + "/login", StandardCharsets.UTF_8);
        String logoutUrl = keycloakEndSessionUri
                + "?post_logout_redirect_uri=" + redirectUri
                + "&client_id=" + clientId;

        LogoutResponse body = new LogoutResponse(logoutUrl);

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return Mono.just(ResponseEntity.ok(body));
        }

        String tokenValue = authHeader.substring(7);
        try {
            var jwt = JWTParser.parse(tokenValue);
            Date expiry = jwt.getJWTClaimsSet().getExpirationTime();
            if (expiry != null && expiry.after(new Date())) {
                long ttl = (expiry.getTime() - System.currentTimeMillis()) / 1000;
                return tokenBlocklistService.block(tokenValue, ttl)
                        .thenReturn(ResponseEntity.ok(body));
            }
        } catch (Exception ignored) {}

        return Mono.just(ResponseEntity.ok(body));
    }
}
