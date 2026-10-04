package org.cbpersonalproject.controller;

import org.cbpersonalproject.dto.MovimientoMensualDto;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/v1/gastosmensuales")
public class GastosMensualesController {

    @GetMapping("/consultarmovimientos")
    public List<MovimientoMensualDto> getMovimientosMensuales() {
        return null ; //movimientosMensuales.getMovimientosMensuales();
    }
}
