package org.cbpersonalproject.controller;

import lombok.RequiredArgsConstructor;
import org.cbpersonalproject.dto.MovimientoResponse;
import org.cbpersonalproject.service.MovimientoService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Flux;

@RestController
@RequiredArgsConstructor
@RequestMapping("/v1/movimiento")
public class MovimientoController {

    private final MovimientoService movimientoService;

    @GetMapping("/movimientos")
    public Flux<MovimientoResponse> getMovimientos() {
        return movimientoService.buscarTodos();
    }
}
