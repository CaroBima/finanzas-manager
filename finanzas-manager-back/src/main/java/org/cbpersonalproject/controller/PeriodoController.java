package org.cbpersonalproject.controller;


import lombok.RequiredArgsConstructor;
import org.cbpersonalproject.dto.MovimientoResponse;
import org.cbpersonalproject.dto.PeriodoResponse;
import org.cbpersonalproject.service.PeriodoService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Flux;

@RestController
@RequiredArgsConstructor
@RequestMapping("/v1/periodo")
public class PeriodoController {
    PeriodoService periodoService;

    @GetMapping("/buscarperiodo")
    public Flux<PeriodoResponse> getPeriodos() {
        return periodoService.buscarTodos();
    }

}
