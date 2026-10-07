package org.cbpersonalproject.repository;

import org.cbpersonalproject.model.MovimientoMensual;
import org.cbpersonalproject.model.TipoMovimiento;
import org.springframework.data.repository.reactive.ReactiveCrudRepository;

public interface TipoMovimientoRepository  extends ReactiveCrudRepository<TipoMovimiento, Integer> {
}
