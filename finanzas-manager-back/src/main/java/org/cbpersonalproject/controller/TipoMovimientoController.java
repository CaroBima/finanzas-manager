package org.cbpersonalproject.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.cbpersonalproject.dto.AltaTipoMovimientoRequest;
import org.cbpersonalproject.dto.TipoMovimientoResponse;
import org.cbpersonalproject.service.TipoMovimientoService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@RestController
@RequiredArgsConstructor
@RequestMapping("/v1/tipomovimiento")
public class TipoMovimientoController {

    private final TipoMovimientoService tipoMovimientoService;

    @GetMapping("/tiposmovimientos")
    public Flux<TipoMovimientoResponse> getMovimientos() {
        return tipoMovimientoService.buscarTodos();
    }

    @PostMapping("/alta")
    public Mono<ResponseEntity<TipoMovimientoResponse>> alta(@Valid @RequestBody AltaTipoMovimientoRequest request) {
        return tipoMovimientoService.altaTipoMovimiento(request);
    }
}
