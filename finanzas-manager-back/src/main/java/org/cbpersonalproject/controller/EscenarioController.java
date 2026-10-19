package org.cbpersonalproject.controller;

import lombok.RequiredArgsConstructor;
import org.cbpersonalproject.dto.MovimientoResponse;
import org.cbpersonalproject.service.EscenarioService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Flux;

@RestController
@RequiredArgsConstructor
@RequestMapping("/v1/escenarios")
public class EscenarioController {
    EscenarioService escenarioService;

    @GetMapping("/escenarios")
    public Flux<MovimientoResponse> getEscenarios() {

        return null; // escenarioService.buscarTodos();
    }

}
