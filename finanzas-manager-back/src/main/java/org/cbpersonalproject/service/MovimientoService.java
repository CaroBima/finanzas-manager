package org.cbpersonalproject.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.cbpersonalproject.dto.MovimientoResponse;
import org.cbpersonalproject.dto.TipoMovimientoResponse;
import org.cbpersonalproject.repository.MovimientoRepository;
import org.cbpersonalproject.repository.TipoMovimientoRepository;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;

@Slf4j
@Service
@RequiredArgsConstructor
public class MovimientoService {
    private final MovimientoRepository movimientoRepo;
    private final TipoMovimientoRepository tipoMovimientoRepo;

    public Flux<MovimientoResponse> buscarTodos() {
        return movimientoRepo.findAll()
                .flatMap(movimiento ->
                        tipoMovimientoRepo
                                .findById(movimiento.getIdTipoMovimiento())
                                .map(tipoMov -> {
                                    TipoMovimientoResponse tipoMovResp =
                                            new TipoMovimientoResponse(
                                                    tipoMov.getIdTipoMovimiento(),
                                                    tipoMov.getNombre(),
                                                    tipoMov.getNaturaleza()
                                            );

                                    return new MovimientoResponse(
                                            movimiento.getNombre(),
                                            movimiento.getDescripcion(),
                                            movimiento.getActivo(),
                                            tipoMovResp
                                    );
                                })
                );
    }
}
