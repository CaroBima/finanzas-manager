package org.cbpersonalproject.repository;

import org.cbpersonalproject.model.Usuario;
import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import reactor.core.publisher.Mono;

public interface UsuarioRepository extends ReactiveCrudRepository<Usuario, Long> {
    Mono<Usuario> findByKeycloakId(String keycloakId);
}
