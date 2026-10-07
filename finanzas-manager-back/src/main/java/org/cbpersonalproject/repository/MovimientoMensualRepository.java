package org.cbpersonalproject.repository;


import org.cbpersonalproject.model.MovimientoMensual;
import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import reactor.core.publisher.Flux;

public interface MovimientoMensualRepository extends ReactiveCrudRepository<MovimientoMensual, Integer> {
    Flux<MovimientoMensual> findByIdPeriodo(int mes, int anio);
}
