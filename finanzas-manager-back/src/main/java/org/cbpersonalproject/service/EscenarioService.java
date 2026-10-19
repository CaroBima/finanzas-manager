package org.cbpersonalproject.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.cbpersonalproject.dto.EscenarioResponse;
import org.cbpersonalproject.model.Escenario;
import org.cbpersonalproject.repository.EscenarioRepository;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@Slf4j
@Service
@RequiredArgsConstructor
public class EscenarioService {
    EscenarioRepository escenarioRepository;

    public Flux<EscenarioResponse> buscarTodos() {
        return escenarioRepository.findAll()
                .flatMap(this::toResponse);
    }

    private Mono<EscenarioResponse> toResponse(Escenario escenario) {
        return null;
    }
}
