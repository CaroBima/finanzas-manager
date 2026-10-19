package org.cbpersonalproject.dto;

import org.cbpersonalproject.model.Escenario;

import java.math.BigDecimal;

public record EscenarioDetalleResponse(EscenarioResponse escenario,
                                       MovimientoResponse movimiento,
                                       BigDecimal monto) {
}
