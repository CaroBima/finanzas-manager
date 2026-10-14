package org.cbpersonalproject.dto;

import java.math.BigDecimal;

public record MovimientoMensualResponse(BigDecimal montoPrevisto,
                                        BigDecimal montoReal,
                                        int nroCuota,
                                        int TotalCuotas,
                                        String notas,
                                        PeriodoResponse periodoResponse,
                                        MovimientoResponse movimientoResponse) {

}
