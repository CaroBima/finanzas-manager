package org.cbpersonalproject.service;

import java.util.List;

import org.cbpersonalproject.dto.MovimientoMensualResponse;
import org.cbpersonalproject.model.MovimientoMensual;
import org.cbpersonalproject.repository.MovimientoMensualRepository;
import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;
import reactor.core.publisher.Flux;

@Service 
@RequiredArgsConstructor
public class MovimientosMensualesService {
    private final MovimientoMensualRepository movMensRepo;

    public Flux<MovimientoMensualResponse> getMovimientosMensuales(){

        Flux<MovimientoMensualResponse> movMensualResp = movMensRepo.findAll()
                .map(mov -> new MovimientoMensualResponse(
                        mov.getIdPeriodo(),
                        mov.getIdMovimiento(),
                        mov.getMontoPrevisto(),
                        mov.getMontoReal(),
                        mov.getNroCuota(),
                        mov.getTotalCuotas(),
                        mov.getNotas()
                ));
        return movMensualResp;
    }
}
