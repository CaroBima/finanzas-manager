package org.cbpersonalproject.dto;

import java.math.BigDecimal;

public record MovimientoMensualResponse(BigDecimal montoPrevisto,
                                        BigDecimal montoReal,
                                        BigDecimal montoSimulado,
                                        Integer nroCuota,
                                        Integer TotalCuotas,
                                        String notas,
                                        PeriodoResponse periodoResponse,
                                        MovimientoResponse movimientoResponse) {

}
