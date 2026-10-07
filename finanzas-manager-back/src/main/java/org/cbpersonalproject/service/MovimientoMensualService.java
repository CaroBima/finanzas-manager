package org.cbpersonalproject.service;

import org.cbpersonalproject.dto.*;
import org.cbpersonalproject.model.Movimiento;
import org.cbpersonalproject.model.MovimientoMensual;
import org.cbpersonalproject.model.Periodo;
import org.cbpersonalproject.repository.MovimientoMensualRepository;
import org.cbpersonalproject.repository.MovimientoRepository;
import org.cbpersonalproject.repository.PeriodoRepository;
import org.cbpersonalproject.repository.TipoMovimientoRepository;
import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@Service 
@RequiredArgsConstructor
public class MovimientoMensualService {

    private final MovimientoMensualRepository movMensRepo;
    private final PeriodoRepository periodoRepo;
    private final MovimientoRepository movimientoRepo;
    private final TipoMovimientoRepository tipoMovimientoRepo;


    public Flux<MovimientoMensualResponse> getMovimientosMensuales() {
        return movMensRepo.findAll()
                .flatMap(this::toResponse);
    }

    private Mono<MovimientoMensualResponse> toResponse(
            MovimientoMensual mov) {
        return Mono.zip(
                periodoRepo.findById(mov.getIdPeriodo())
                        .switchIfEmpty(Mono.error(new RuntimeException("Periodo no encontrado: " + mov.getIdPeriodo()))),
                movimientoRepo.findById(mov.getIdMovimiento())
                        .switchIfEmpty(Mono.error(new RuntimeException("Movimiento no encontrado: " + mov.getIdMovimiento())))
        ).flatMap(datos -> {
            Periodo periodo = datos.getT1() ;
            Movimiento movimiento = datos.getT2();

            return tipoMovimientoRepo
                    .findById(movimiento.getIdTipoMovimiento())
                    .switchIfEmpty(Mono.error(new RuntimeException("Tipo de Movimiento no encontrado: " + movimiento.getIdTipoMovimiento())))
                    .map(tipo -> new MovimientoMensualResponse(
                            mov.getMontoPrevisto(),
                            mov.getMontoReal(),
                            mov.getNroCuota(),
                            mov.getTotalCuotas(),
                            mov.getNotas(),
                            new PeriodoResponse(
                                    periodo.getAnio(),
                                    periodo.getMes()
                            ),
                            new MovimientoResponse(
                                    movimiento.getNombre(),
                                    movimiento.getDescripcion(),
                                    movimiento.getActivo(),
                                    new TipoMovimientoResponse(
                                            tipo.getNombre(),
                                            tipo.getNaturaleza()

                            ))

                    ));
        });
    }

    public Flux<MovimientoPorPeriodoResponse> getMovimientoMensualPorPeriodo(int mes, int anio){
         return movMensRepo.findByPeriodo(mes, anio);
    }

}
