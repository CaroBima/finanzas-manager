package org.cbpersonalproject.repository;

import org.cbpersonalproject.model.Movimiento;
import org.cbpersonalproject.model.Periodo;
import org.springframework.data.r2dbc.repository.Query;
import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import reactor.core.publisher.Mono;

public interface MovimientoRepository  extends ReactiveCrudRepository<Movimiento, Integer> {

    Mono<Movimiento> findByNombre(String nombre);
}
