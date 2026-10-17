package org.cbpersonalproject.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.cbpersonalproject.dto.AltaMovimientoRequest;
import org.cbpersonalproject.dto.MovimientoRequest;
import org.cbpersonalproject.dto.MovimientoResponse;
import org.cbpersonalproject.dto.TipoMovimientoResponse;
import org.cbpersonalproject.model.Movimiento;
import org.cbpersonalproject.model.MovimientoMensual;
import org.cbpersonalproject.repository.MovimientoMensualRepository;
import org.cbpersonalproject.repository.MovimientoRepository;
import org.cbpersonalproject.repository.PeriodoRepository;
import org.cbpersonalproject.repository.TipoMovimientoRepository;
import org.cbpersonalproject.utils.Constantes;
import org.springframework.data.redis.core.ReactiveStringRedisTemplate;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import java.time.Duration;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class MovimientoService {
    private final MovimientoRepository movimientoRepo;
    private final MovimientoMensualRepository movimientoMensualRepo;
    private final TipoMovimientoRepository tipoMovimientoRepo;
    private final PeriodoRepository periodoRepo;
    private final ReactiveStringRedisTemplate redis;
    private final ObjectMapper objectMapper;

    /**
     * Busca todos los movimientos registrados en Redis, si no se encuentra en caché
     * los busca en la base de datos y los guarda en el caché
     * @return listado de movimientos (tipo de movimiento, nombre, descripcion, activo)
     */
    public Flux<MovimientoResponse> buscarTodos() {
        long tiempoCache = Constantes.CACHE_TTL.toSeconds()
                + (long) (Math.random() * Constantes.CACHE_TTL_JITTER_SECONDS);

        return redis.opsForValue()
                .get(Constantes.CACHE_KEY_MOVIMIENTO)
                .flatMapMany(json ->{
                   try{
                       List<MovimientoResponse> movimientos =
                               objectMapper.readValue(json,
                                       new TypeReference<List<MovimientoResponse>>() {}
                               );
                       return Flux.fromIterable(movimientos);
                   } catch(JsonProcessingException e){
                       log.info("Sin movimiento en caché. Se cachea.");
                       return redis.delete(Constantes.CACHE_KEY_MOVIMIENTO)
                               .thenMany(buscarTodosYCachear());
                   }
                })
                .switchIfEmpty(buscarTodosYCachear());
    }

    /**
     * Consulta todos los movimientos almacenados en la base de datos y guarda el resultado en caché
     * @return todos los movimientos
     */
    private Flux<MovimientoResponse> buscarTodosYCachear(){
        long tiempoCache = Constantes.CACHE_TTL.toSeconds()
                + (long) (Math.random() * Constantes.CACHE_TTL_JITTER_SECONDS);
        return mapearMovimiento()
                .collectList()
                .flatMapMany(lista -> {
                    try{
                        String json = objectMapper.writeValueAsString(lista);
                        return redis.opsForValue()
                                    .set(Constantes.CACHE_KEY_MOVIMIENTO, json, Duration.ofSeconds(tiempoCache))
                                    .thenMany(Flux.fromIterable(lista));
                    }catch(JsonProcessingException e){
                        log.info("consultarYCachearPeriodo: Error al cachear Período");
                        return Flux.error(e);
                    }
                });

    }

    public Mono<ResponseEntity<MovimientoResponse>> nuevoMovimiento(MovimientoRequest request){
        String cacheKey = Constantes.CACHE_KEY_MOVIMIENTO;
        return mapearMovimientoAGuardar(request)
                .flatMap(movimientoRepo::save)
                .zipWith(periodoRepo.findByMesAndAnio(request.mes(), request.anio()))
                .flatMap(tuple -> {
                    Movimiento savedMovimiento = tuple.getT1();
                    MovimientoMensual mensual = new MovimientoMensual();
                    mensual.setIdMovimiento(savedMovimiento.getIdMovimiento());
                    mensual.setIdPeriodo(tuple.getT2().getIdPeriodo());
                    mensual.setMontoPrevisto(request.montoPrevisto());
                    mensual.setMontoReal(request.montoReal());
                    mensual.setNroCuota(request.nroCuota());
                    mensual.setTotalCuotas(request.totalCuotas());
                    mensual.setNotas(request.notas());
                    return movimientoMensualRepo.save(mensual).thenReturn(savedMovimiento);
                })
                .flatMap(saved -> redis.delete(cacheKey).thenReturn(saved))
                .flatMap(saved -> tipoMovimientoRepo.findById(saved.getIdTipoMovimiento())
                        .map(tipoMov -> new MovimientoResponse(
                                saved.getNombre(),
                                saved.getDescripcion(),
                                saved.getActivo(),
                                new TipoMovimientoResponse(
                                        tipoMov.getIdTipoMovimiento(),
                                        tipoMov.getNombre(),
                                        tipoMov.getNaturaleza()
                                )
                        )))
                .map(ResponseEntity::ok);
    }

    public Mono<ResponseEntity<MovimientoResponse>> altaMovimiento(AltaMovimientoRequest request) {
        Movimiento nuevo = new Movimiento();
        nuevo.setNombre(request.nombre());
        nuevo.setDescripcion(request.descripcion());
        nuevo.setActivo(request.activo() != null ? request.activo() : true);
        nuevo.setIdTipoMovimiento(request.tipoMov().idTipoMovimiento());
        return movimientoRepo.save(nuevo)
                .flatMap(saved -> redis.delete(Constantes.CACHE_KEY_MOVIMIENTO).thenReturn(saved))
                .map(saved -> new MovimientoResponse(
                        saved.getNombre(),
                        saved.getDescripcion(),
                        saved.getActivo(),
                        request.tipoMov()
                ))
                .map(ResponseEntity::ok);
    }

    private Mono<Movimiento> mapearMovimientoAGuardar(MovimientoRequest request){
        return tipoMovimientoRepo.findByTipoAndNaturaleza(request.tipoMovimiento(), request.naturaleza())
                .map(tipoMov -> {
                    Movimiento nuevo = new Movimiento();
                    nuevo.setIdTipoMovimiento(tipoMov.getIdTipoMovimiento());
                    nuevo.setNombre(request.nombreMovimiento());
                    nuevo.setDescripcion(request.descripcionMovimiento());
                    nuevo.setActivo(true);
                    return nuevo;
                });
    }

    private Flux<MovimientoResponse> mapearMovimiento(){
        return movimientoRepo.findAll()
                .flatMap(movimiento -> {
                    return tipoMovimientoRepo.findById(movimiento.getIdTipoMovimiento())
                            .map(tipoMov -> {
                                return new MovimientoResponse(
                                        movimiento.getNombre(),
                                        movimiento.getDescripcion(),
                                        movimiento.getActivo(),
                                        new TipoMovimientoResponse(
                                                tipoMov.getIdTipoMovimiento(),
                                                tipoMov.getNombre(),
                                                tipoMov.getNaturaleza()
                                        )
                                );
                            });
                });
    }

}
