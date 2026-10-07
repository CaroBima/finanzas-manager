package org.cbpersonalproject.repository;

import java.util.List;

import org.cbpersonalproject.model.MovimientoMensual;
import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import reactor.core.publisher.Mono;
import reactor.core.publisher.Flux;

public interface MovimientoMensualRepository extends ReactiveCrudRepository<MovimientoMensual, Integer> {
    Mono<MovimientoMensual> findByPeriodo(int idPeriodo);
}
