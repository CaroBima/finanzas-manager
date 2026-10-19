package org.cbpersonalproject.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.cbpersonalproject.model.Periodo;
import org.cbpersonalproject.repository.PeriodoRepository;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

@Slf4j
@Service
@RequiredArgsConstructor
public class PeriodoService {
    private final PeriodoRepository periodoRepo;

    /**
     * Busca un período en la base de datos, si no encuentra resultados, lo guarda.
     * @param mes
     * @param anio
     * @return Mono<Periodo> con el periodo encontrado o creado
     */
    public Mono<Periodo> buscarPeriodo(int mes, int anio){
        return periodoRepo.findByMesAndAnio(mes, anio)
                .switchIfEmpty(Mono.defer(() -> {
                    Periodo nuevoPeriodo = new Periodo();
                    nuevoPeriodo.setMes(mes);
                    nuevoPeriodo.setAnio(anio);

                    return periodoRepo.save(nuevoPeriodo);
                }));
    }

    public Mono<Periodo> BuscarPorId(Integer idPeriodo) {
        return periodoRepo.findById(idPeriodo);
    }
}
