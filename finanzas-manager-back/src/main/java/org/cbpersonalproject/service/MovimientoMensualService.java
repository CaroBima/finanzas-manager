package org.cbpersonalproject.service;

import org.cbpersonalproject.dto.*;
import org.cbpersonalproject.model.Movimiento;
import org.cbpersonalproject.model.MovimientoMensual;
import org.cbpersonalproject.model.Periodo;
import org.cbpersonalproject.repository.MovimientoMensualRepository;
import org.cbpersonalproject.repository.MovimientoRepository;
import org.cbpersonalproject.repository.PeriodoRepository;
import org.cbpersonalproject.repository.TipoMovimientoRepository;
import org.springframework.data.redis.core.ReactiveStringRedisTemplate;
import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import java.time.YearMonth;
import java.util.List;
import java.time.Duration;

@Service 
@RequiredArgsConstructor
public class MovimientoMensualService {

    private final MovimientoMensualRepository movMensRepo;
    private final PeriodoRepository periodoRepo;
    private final MovimientoRepository movimientoRepo;
    private final TipoMovimientoRepository tipoMovimientoRepo;
    private final ReactiveStringRedisTemplate redis;
    private final ObjectMapper objectMapper;

    private static final String CACHE_KEY = "finanzas:movimientos:ultimos-3-meses";
    private static final Duration CACHE_TTL = Duration.ofMinutes(10);
    private static final long CACHE_TTL_JITTER_SECONDS = 30;


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

    /**
     * Obtiene los movimientos correspondientes a un mes y año determinados.
     * Busca los datos en la caché de Redis y, si no existen o no se pueden deserializar, los consulta en la base de datos y los almacena en caché.
     * @param mes mes del período a consultar
     * @param anio año del período a consultar
     * @return Flux con los movimientos del período solicitado.
     */
    public Flux<MovimientoPorPeriodoResponse> getMovimientoMensualPorPeriodo(
            int mes, int anio) {

        String cacheKeyMensual =
                "finanzas:movimientos:" + anio + ":" + mes;

        long tiempoCache = CACHE_TTL.toSeconds()
                + (long) (Math.random() * CACHE_TTL_JITTER_SECONDS);

        return redis.opsForValue()
                .get(cacheKeyMensual)
                .flatMapMany(json -> {
                    try {
                        List<MovimientoPorPeriodoResponse> movimientos =
                                objectMapper.readValue(
                                        json,
                                        new TypeReference<
                                                List<MovimientoPorPeriodoResponse>>() {}
                                );

                        return Flux.fromIterable(movimientos);

                    } catch (JsonProcessingException e) {
                        return redis.delete(cacheKeyMensual)
                                .thenMany(consultarYCachearPeriodo(
                                        mes, anio, cacheKeyMensual, tiempoCache));
                    }
                })
                .switchIfEmpty(
                        consultarYCachearPeriodo(
                                mes, anio, cacheKeyMensual, tiempoCache)
                );
    }

    /**
     * Busca en la base de datos los movimientos de un período determinado y lo guarda en el caché de Redis
     * @param mes correspondiente al período a buscar
     * @param anio correspondiente al período a buscar
     * @param cacheKey key del caché
     * @param tiempoCache tiempo por el cual se guardará la información en caché
     * @return
     */
    private Flux<MovimientoPorPeriodoResponse> consultarYCachearPeriodo(
            int mes, int anio, String cacheKey, long tiempoCache) {

        return movMensRepo.findByPeriodo(mes, anio)
                .collectList()
                .flatMapMany(movimientos -> {
                    try {
                        String json = objectMapper.writeValueAsString(movimientos);

                        return redis.opsForValue()
                                .set(cacheKey, json, Duration.ofSeconds(tiempoCache))
                                .thenMany(Flux.fromIterable(movimientos));

                    } catch (JsonProcessingException e) {
                        return Flux.error(e);
                    }
                });
    }

    /**
     * Consulta los moivimientos correspondientes a los últimos 3 meses y guarda el resultado en la caché de Redis
     *
     * @return los movimientos de los último 3 períodos
     */
    private Flux<MovimientoPorPeriodoResponse> consultarYCachear() {
        YearMonth hasta = YearMonth.now();
        YearMonth desde = hasta.minusMonths(2);
        int mesHasta = hasta.getMonthValue();
        int anioHasta = hasta.getYear();
        int mesDesde = desde.getMonthValue();
        int anioDesde = desde.getYear();
        long tiempoCache = (CACHE_TTL).toSeconds() + (long)(Math.random() * CACHE_TTL_JITTER_SECONDS);

        return movMensRepo.findMovimientosDelPeriodo(mesDesde, anioDesde, mesHasta, anioHasta)
                .collectList()
                .flatMapMany(movimientos -> {
                    try {
                        String json =
                                objectMapper.writeValueAsString(movimientos);

                        return redis.opsForValue()
                                .set(CACHE_KEY, json, tiempoCache)
                                .thenMany(Flux.fromIterable(movimientos));
                    } catch (JsonProcessingException e) {
                        return Flux.error(e);
                    }
                });
    }

    /**
     * Permite obtener la información de movimientos correspondiente a los ultimos tres meses, que se encuentra almacenada en caché de Redis
     * En caso de no encontrarse la información en caché la busca en la base de datos y la guardaen caché
     * @return información de los movimientos de los ultimos 3 meses
     */
    public Flux<MovimientoPorPeriodoResponse> getUltimosTresMeses(){
        return redis.opsForValue()
                .get(CACHE_KEY)
                .flatMapMany(json -> {
                    try {
                        List<MovimientoPorPeriodoResponse> movimientos = objectMapper.readValue(json, new TypeReference<List<MovimientoPorPeriodoResponse>>() {
                        });
                        return Flux.fromIterable(movimientos);
                    } catch (JsonProcessingException e) {
                        return redis.delete(CACHE_KEY)
                                .thenMany(consultarYCachear());
                    }
                })
                .switchIfEmpty(consultarYCachear());
    }
}
