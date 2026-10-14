package org.cbpersonalproject.repository;

import org.cbpersonalproject.dto.MovimientoPorPeriodoResponse;
import org.cbpersonalproject.model.MovimientoMensual;
import org.cbpersonalproject.model.Periodo;
import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

public interface PeriodoRepository  extends ReactiveCrudRepository<Periodo, Integer> {
    Mono<Periodo> findByMesYAnio(int mes, int anio);
}
