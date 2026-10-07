package org.cbpersonalproject.dto;

public record MovimientoResponse(String nombre,
                                 String descripcion,
                                 Boolean activo,
                                 TipoMovimientoResponse tipoMov) {
}
