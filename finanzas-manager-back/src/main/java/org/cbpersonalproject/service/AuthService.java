package org.cbpersonalproject.service;

import lombok.RequiredArgsConstructor;
import org.cbpersonalproject.model.Usuario;
import org.cbpersonalproject.repository.UsuarioRepository;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

import java.time.OffsetDateTime;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UsuarioRepository usuarioRepository;

    public Mono<Void> processLogin(OAuth2User oauth2User) {
        String keycloakId = oauth2User.getAttribute("sub");
        String email = oauth2User.getAttribute("email");
        String nombre = oauth2User.getAttribute("given_name");
        String apellido = oauth2User.getAttribute("family_name");

        return usuarioRepository.findByKeycloakId(keycloakId)
                .flatMap(existing -> {
                    existing.setFechaUltimoLogin(OffsetDateTime.now());
                    return usuarioRepository.save(existing);
                })
                .switchIfEmpty(Mono.defer(() -> {
                    Usuario nuevo = new Usuario();
                    nuevo.setKeycloakId(keycloakId);
                    nuevo.setEmail(email);
                    nuevo.setNombre(nombre);
                    nuevo.setApellido(apellido);
                    nuevo.setFechaRegistro(OffsetDateTime.now());
                    nuevo.setFechaUltimoLogin(OffsetDateTime.now());
                    nuevo.setActivo(true);
                    return usuarioRepository.save(nuevo);
                }))
                .then();
    }
}
