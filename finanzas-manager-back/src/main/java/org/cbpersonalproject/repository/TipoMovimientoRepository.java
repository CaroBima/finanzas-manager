package org.cbpersonalproject.repository;

import org.cbpersonalproject.model.MovimientoMensual;
import org.cbpersonalproject.model.Periodo;
import org.cbpersonalproject.model.TipoMovimiento;
import org.springframework.data.r2dbc.repository.Query;
import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import reactor.core.publisher.Mono;

public interface TipoMovimientoRepository  extends ReactiveCrudRepository<TipoMovimiento, Integer> {
    @Query("""
            Select id_tipo_movimiento, nombre, naturaleza
            from tipo_movimiento 
            where nombre = :nombreTipo
            and naturaleza = :naturaleza
            """)
    Mono<TipoMovimiento> findByTipoYNaturaleza(String nombreTipo, String naturaleza);
}
