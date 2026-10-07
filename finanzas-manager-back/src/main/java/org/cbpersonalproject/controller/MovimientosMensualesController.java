package org.cbpersonalproject.controller;

import lombok.RequiredArgsConstructor;
import org.cbpersonalproject.dto.MovimientoMensualResponse;
import org.cbpersonalproject.dto.MovimientoRequest;
import org.cbpersonalproject.service.MovimientosMensualesService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@RestController
@RequiredArgsConstructor
@RequestMapping("/v1/controlmensual")
public class MovimientosMensualesController {

    private static MovimientosMensualesService movimientosMensuales;

    @GetMapping("/movimientos")
    public Flux<MovimientoMensualResponse> getMovimientos() {
        return movimientosMensuales.getMovimientosMensuales();
    }

    @GetMapping("/tiposmovimiento")
    public Flux<ResponseEntity<MovimientoMensualResponse>> getTiposMovimiento() {
        return null ; //movimientosMensuales.getMovimientosMensuales();
    }

    @GetMapping("/movimientos/{id}")
    public Flux<ResponseEntity<MovimientoMensualResponse>> getMovimientosPorId(@RequestParam int id) {
        return null ; //movimientosMensuales.getMovimientosMensuales();
    }

    @GetMapping("/movimientospormes")
    public Flux<ResponseEntity<MovimientoMensualResponse>> getMovimientosPorMes(@RequestParam int mes, 
                                                                @RequestParam int anio) {
        return null ; //movimientosMensuales.getMovimientosMensuales();
    }

    @PostMapping
    public Mono<ResponseEntity<MovimientoMensualResponse>> crearMovimiento(@Valid @RequestBody MovimientoRequest request){
        return null;
    }
}

