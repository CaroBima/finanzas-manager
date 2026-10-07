package org.cbpersonalproject.repository;

import org.cbpersonalproject.model.Escenario;
import org.cbpersonalproject.model.EscenarioDetalle;
import org.cbpersonalproject.model.MovimientoMensual;
import org.springframework.data.repository.reactive.ReactiveCrudRepository;

public interface EscenarioDetalleRepository  extends ReactiveCrudRepository<EscenarioDetalle, Integer> {
}
