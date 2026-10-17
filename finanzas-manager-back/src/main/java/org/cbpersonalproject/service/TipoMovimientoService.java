package org.cbpersonalproject.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.cbpersonalproject.dto.AltaTipoMovimientoRequest;
import org.cbpersonalproject.dto.TipoMovimientoResponse;
import org.cbpersonalproject.model.TipoMovimiento;
import org.cbpersonalproject.repository.TipoMovimientoRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

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

    public Mono<ResponseEntity<TipoMovimientoResponse>> altaTipoMovimiento(AltaTipoMovimientoRequest request) {
        TipoMovimiento nuevo = new TipoMovimiento();
        nuevo.setNombre(request.nombre());
        nuevo.setNaturaleza(request.naturaleza());
        return tipoMovimientoRepository.save(nuevo)
                .map(saved -> new TipoMovimientoResponse(
                        saved.getIdTipoMovimiento(),
                        saved.getNombre(),
                        saved.getNaturaleza()
                ))
                .map(ResponseEntity::ok);
    }
}
