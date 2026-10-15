package org.cbpersonalproject.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.cbpersonalproject.dto.TipoMovimientoResponse;
import org.cbpersonalproject.repository.TipoMovimientoRepository;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;

@Slf4j
@Service
@RequiredArgsConstructor
public class TipoMovimientoService {

    private final TipoMovimientoRepository tipoMovimientoRepository;

    public Flux<TipoMovimientoResponse> buscarTodos() {
        return tipoMovimientoRepository.findAll()
                .map(response -> new TipoMovimientoResponse(
                        response.getIdTipoMovimiento(),
                        response.getNombre(),
                        response.getNaturaleza()
                ));
    }
}
