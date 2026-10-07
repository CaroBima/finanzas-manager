package org.cbpersonalproject.dto;

public record MovimientoPorPeriodoResponse(String nombreMovimiento,
                                           String descripcion,
                                           Double montoPrevisto,
                                           Double montoReal,
                                           int nroCuota,
                                           int totalCuotas,
                                           String notas,
                                           String nombreTipoMovimiento,
                                           String naturalezaTipoMov,
                                           int anio,
                                           int mes) {
}
