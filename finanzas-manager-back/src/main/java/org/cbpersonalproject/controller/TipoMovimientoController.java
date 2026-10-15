package org.cbpersonalproject.controller;

import lombok.RequiredArgsConstructor;
import org.cbpersonalproject.dto.MovimientoMensualResponse;
import org.cbpersonalproject.dto.TipoMovimientoResponse;
import org.cbpersonalproject.service.TipoMovimientoService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Flux;

@RestController
@RequiredArgsConstructor
@RequestMapping("/v1/tipomovimiento")
public class TipoMovimientoController {

    private final TipoMovimientoService tipoMovimientoService;

    @GetMapping("/tiposmovimientos")
    public Flux<TipoMovimientoResponse> getMovimientos() {
        return tipoMovimientoService.buscarTodos();
    }
}
