package org.cbpersonalproject.dto;

public record MovimientoMensualResponse(double montoPrevisto,
                                        double montoReal,
                                        int nroCuota,
                                        int TotalCuotas,
                                        String notas,
                                        PeriodoResponse periodoResponse,
                                        MovimientoResponse movimientoResponse) {

}
