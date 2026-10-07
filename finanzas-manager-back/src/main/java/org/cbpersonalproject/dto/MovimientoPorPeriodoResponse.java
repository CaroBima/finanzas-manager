package org.cbpersonalproject.dto;

public record MovimientoPorPeriodoResponse(String nombreMovimiento,
                                           String descripcion,
                                           Double montoPrevisto,
                                           Double montoReal,
                                           Integer nroCuota,
                                           Integer totalCuotas,
                                           String notas,
                                           String nombreTipoMovimiento,
                                           String naturalezaTipoMov,
                                           Integer anio,
                                           Integer mes) {
}
