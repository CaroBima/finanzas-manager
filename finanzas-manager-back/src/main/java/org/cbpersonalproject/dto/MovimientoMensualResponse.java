package org.cbpersonalproject.dto;

import org.cbpersonalproject.model.Movimiento;
import org.cbpersonalproject.model.Periodo;

public record MovimientoMensualResponse(int idPeriodo, int idMovimiento, double montoPrevisto, double montoReal, int nroCuota, int TotalCuotas, String notas ) {
    
    
}
