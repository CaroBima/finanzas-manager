package org.cbpersonalproject.repository;

import org.cbpersonalproject.model.Escenario;
import org.cbpersonalproject.model.MovimientoMensual;
import org.springframework.data.repository.reactive.ReactiveCrudRepository;

public interface EscenarioRepository  extends ReactiveCrudRepository<Escenario, Integer> {
}
