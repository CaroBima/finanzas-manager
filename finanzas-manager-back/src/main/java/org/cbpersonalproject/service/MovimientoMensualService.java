package org.cbpersonalproject.service;

import org.cbpersonalproject.dto.*;
import org.cbpersonalproject.model.Movimiento;
import org.cbpersonalproject.model.MovimientoMensual;
import org.cbpersonalproject.model.Periodo;
import org.cbpersonalproject.repository.MovimientoMensualRepository;
import org.cbpersonalproject.utils.Constantes;
import org.springframework.data.redis.core.ReactiveStringRedisTemplate;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import java.time.YearMonth;
import java.util.List;
import java.time.Duration;


@Slf4j
@Service 
@RequiredArgsConstructor
public class MovimientoMensualService {

    private final MovimientoMensualRepository movMensRepo;
    private final PeriodoService periodoService;
    private final MovimientoService movimientoService;
    private final TipoMovimientoService tipoMovimientoService;
    private final ReactiveStringRedisTemplate redis;
    private final ObjectMapper objectMapper;
    private static final String CACHE_KEY = Constantes.CACHE_KEY_MOVIMIENTOS_MENSUALES + "ultimos-3-meses";


    public Flux<MovimientoMensualResponse> getMovimientosMensuales() {
        return movMensRepo.findAll()
                .flatMap(this::toResponse);
    }

    private Mono<MovimientoMensualResponse> toResponse(MovimientoMensual mov) {
        return Mono.zip(
                periodoService.BuscarPorId(mov.getIdPeriodo())
                        .switchIfEmpty(Mono.error(new RuntimeException("Periodo no encontrado: " + mov.getIdPeriodo()))),
                movimientoService.buscarPorId(mov.getIdMovimiento())
                        .switchIfEmpty(Mono.error(new RuntimeException("Movimiento no encontrado: " + mov.getIdMovimiento())))
        ).flatMap(datos -> {
            Periodo periodo = datos.getT1();
            Movimiento movimiento = datos.getT2();
            return tipoMovimientoService
                    .buscarPorId(movimiento.getIdTipoMovimiento())
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
                                            tipo.getIdTipoMovimiento(),
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

        String cacheKeyMensual = Constantes.CACHE_KEY_MOVIMIENTOS_MENSUALES + anio + ":" + mes;

        long tiempoCache = Constantes.CACHE_TTL.toSeconds()
                + (long) (Math.random() * Constantes.CACHE_TTL_JITTER_SECONDS);

        return redis.opsForValue()
                .get(cacheKeyMensual)
                .onErrorResume(e-> {
                    log.warn("getMovimientoMensualPorPeriodo - Error al consultar Redis: {}", e.getMessage());
                    return Mono.empty();
                })
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
                        log.info("getMovimientoMensualPorPeriodo: Período {}-{} no encontrado en caché. Se cachea.", mes, anio);
                        return redis.delete(cacheKeyMensual)
                                .thenMany(consultarYCachearPeriodo(
                                        mes, anio, cacheKeyMensual, tiempoCache));
                    }
                })
                .switchIfEmpty(consultarYCachearPeriodo(mes, anio, cacheKeyMensual, tiempoCache)
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
                        log.info("consultarYCachearPeriodo: Error al cachear Período {}-{}", mes, anio);
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
        long tiempoCache = (Constantes.CACHE_TTL).toSeconds() + (long)(Math.random() * Constantes.CACHE_TTL_JITTER_SECONDS);

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
                        log.info("consultarYCachear: Error al cachear datos entre Períodos {}-{} hasta {}-{}", mesDesde, anioDesde, mesHasta, anioHasta);
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
                .onErrorResume(e-> {
                    log.warn("MovimientoPorPeriodoResponse - Error al consultar Redis: {}", e.getMessage());
                    return Mono.empty();
                })
                .flatMapMany(json -> {
                    try {
                        List<MovimientoPorPeriodoResponse> movimientos = objectMapper.readValue(json, new TypeReference<List<MovimientoPorPeriodoResponse>>() {
                        });
                        return Flux.fromIterable(movimientos);
                    } catch (JsonProcessingException e) {
                        log.info("getUltimosTresMeses: información no cacheada, se busca y cachea");
                        return redis.delete(CACHE_KEY)
                                .thenMany(consultarYCachear());
                    }
                })
                .switchIfEmpty(consultarYCachear());
    }

    public Mono<ResponseEntity<MovimientoMensualResponse>> guardarMovimientoMensual(MovimientoRequest request){
        String cacheKey =  Constantes.CACHE_KEY_MOVIMIENTOS_MENSUALES + request.anio() + ":" + request.mes();
        return mapearMovimientoMensual(request)
                .flatMap(movMensRepo::save)
                .flatMap(saved -> redis.delete(cacheKey).thenReturn(saved))
                .flatMap(this::toResponse)
                .map(ResponseEntity::ok);
    }

    private Mono<MovimientoMensual> mapearMovimientoMensual(MovimientoRequest request) {
        return Mono.zip(
                periodoService.buscarPeriodo(request.mes(), request.anio()),
                movimientoService.buscarOCrearMovimiento(request)
        ).map(resultado -> {
            MovimientoMensual nuevoMovimientoMensual = new MovimientoMensual();
            nuevoMovimientoMensual.setIdPeriodo(resultado.getT1().getIdPeriodo());
            nuevoMovimientoMensual.setIdMovimiento(resultado.getT2().getIdMovimiento());
            nuevoMovimientoMensual.setMontoPrevisto(request.montoPrevisto());
            nuevoMovimientoMensual.setMontoReal(request.montoReal());
            nuevoMovimientoMensual.setNroCuota(request.nroCuota());
            nuevoMovimientoMensual.setTotalCuotas(request.totalCuotas());
            nuevoMovimientoMensual.setNotas(request.notas());
            return nuevoMovimientoMensual;
        });
    }






}
