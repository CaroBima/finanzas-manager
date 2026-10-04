package org.cbpersonalproject.controller;

import java.util.List;

import org.cbpersonalproject.dto.MovimientoMensualResponse;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/v1/gastosmensuales")
public class MovimientosMensualesController {

    @GetMapping("/movimientos")
    public List<MovimientoMensualResponse> getMovimientos() {
        return null ; //movimientosMensuales.getMovimientosMensuales();
    }

    @GetMapping("/movimientos/{id}")
    public List<MovimientoMensualResponse> getMovimientosPorId(@RequestParam int id) {
        return null ; //movimientosMensuales.getMovimientosMensuales();
    }

    @GetMapping("/movimientospormes")
    public List<MovimientoMensualResponse> getMovimientosMensuales() {
        return null ; //movimientosMensuales.getMovimientosMensuales();
    }
}

/*
Endpoints:

GET    /api/expenses
GET    /api/expenses/{id}
POST   /api/expenses
PUT    /api/expenses/{id}
DELETE /api/expenses/{id}

Y agregaría algunos específicos:

GET /api/expenses?month=2026-10
GET /api/expenses/summary?month=2026-10
 */
