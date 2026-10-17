package org.cbpersonalproject.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.cbpersonalproject.dto.AltaMovimientoRequest;
import org.cbpersonalproject.dto.MovimientoRequest;
import org.cbpersonalproject.dto.MovimientoResponse;
import org.cbpersonalproject.service.MovimientoService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@RestController
@RequiredArgsConstructor
@RequestMapping("/v1/movimiento")
public class MovimientoController {

    private final MovimientoService movimientoService;

    @GetMapping("/movimientos")
    public Flux<MovimientoResponse> getMovimientos() {
        return movimientoService.buscarTodos();
    }

    @PostMapping("/nuevomovimiento")
    public Mono<ResponseEntity<MovimientoResponse>> nuevoMovimiento(@Valid @RequestBody MovimientoRequest request){
        return movimientoService.nuevoMovimiento(request);
    }

    @PostMapping("/alta")
    public Mono<ResponseEntity<MovimientoResponse>> alta(@Valid @RequestBody AltaMovimientoRequest request) {
        return movimientoService.altaMovimiento(request);
    }
}
