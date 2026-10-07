package org.cbpersonalproject.repository;

import org.cbpersonalproject.model.Movimiento;
import org.springframework.data.repository.reactive.ReactiveCrudRepository;

public interface MovimientoRepository  extends ReactiveCrudRepository<Movimiento, Integer> {
}
