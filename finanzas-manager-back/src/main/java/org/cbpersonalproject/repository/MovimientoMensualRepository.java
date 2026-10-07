package org.cbpersonalproject.repository;


import org.cbpersonalproject.dto.MovimientoPorPeriodoResponse;
import org.cbpersonalproject.model.MovimientoMensual;
import org.springframework.data.r2dbc.repository.Query;
import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import reactor.core.publisher.Flux;

public interface MovimientoMensualRepository extends ReactiveCrudRepository<MovimientoMensual, Integer> {

    @Query("""
            Select m.nombre as nombre_movimiento,
            m.descripcion as descripcion,
            mm.monto_previsto as monto_previsto,
            mm.monto_real as monto_real,
            mm.nro_cuota as nro_cuota,
            mm.total_cuotas as total_cuotas,
            mm.notas as notas,
            tm.nombre as nombre_tipo_movimiento,
            tm.naturaleza as naturaleza_tipo_mov,
            p.anio as anio,
            p.mes as mes
            from movimiento_mensual mm
            join movimiento m on m.id_movimiento = mm.id_movimiento
            join tipo_movimiento tm on tm.id_tipo_movimiento = m.id_tipo_movimiento
            INNER join periodo p on p.id_periodo = mm.id_periodo
            where p.anio = :anio and p.mes = :mes
            """)
    Flux<MovimientoPorPeriodoResponse> findByPeriodo(int mes, int anio);

    /*    SELECT mm.*
    FROM movimiento_mensual mm
    INNER JOIN periodo p ON p.id_periodo = mm.id_periodo
    WHERE p.mes = :mes
      AND p.anio = :anio*/
}
