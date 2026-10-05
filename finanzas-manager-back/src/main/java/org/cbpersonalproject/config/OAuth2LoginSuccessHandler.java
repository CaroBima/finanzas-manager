package org.cbpersonalproject.config;

import lombok.RequiredArgsConstructor;
import org.cbpersonalproject.service.AuthService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClient;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.client.web.server.ServerOAuth2AuthorizedClientRepository;
import org.springframework.security.web.server.WebFilterExchange;
import org.springframework.security.web.server.authentication.ServerAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import reactor.core.publisher.Mono;

import java.net.URI;

@Component
@RequiredArgsConstructor
public class OAuth2LoginSuccessHandler implements ServerAuthenticationSuccessHandler {

    private final AuthService authService;
    private final ServerOAuth2AuthorizedClientRepository authorizedClientRepository;

    @Value("${app.frontend-url}")
    private String frontendUrl;

    @Override
    public Mono<Void> onAuthenticationSuccess(WebFilterExchange exchange, Authentication authentication) {
        OAuth2AuthenticationToken oauthToken = (OAuth2AuthenticationToken) authentication;
        String registrationId = oauthToken.getAuthorizedClientRegistrationId();

        return authService.processLogin(oauthToken.getPrincipal())
                .then(authorizedClientRepository.loadAuthorizedClient(
                        registrationId, authentication, exchange.getExchange()))
                .map(OAuth2AuthorizedClient::getAccessToken)
                .map(accessToken -> accessToken.getTokenValue())
                .flatMap(token -> {
                    URI location = URI.create(frontendUrl + "/auth/callback?token=" + token);
                    exchange.getExchange().getResponse().setStatusCode(HttpStatus.FOUND);
                    exchange.getExchange().getResponse().getHeaders().setLocation(location);
                    return exchange.getExchange().getResponse().setComplete();
                });
    }
}
