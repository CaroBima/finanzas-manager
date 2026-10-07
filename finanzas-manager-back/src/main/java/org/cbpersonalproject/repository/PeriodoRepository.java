package org.cbpersonalproject.repository;

import org.cbpersonalproject.model.MovimientoMensual;
import org.cbpersonalproject.model.Periodo;
import org.springframework.data.repository.reactive.ReactiveCrudRepository;

public interface PeriodoRepository  extends ReactiveCrudRepository<Periodo, Integer> {
}
