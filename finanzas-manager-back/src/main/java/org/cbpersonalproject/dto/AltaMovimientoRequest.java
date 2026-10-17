package org.cbpersonalproject.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record AltaMovimientoRequest(
        @NotBlank String nombre,
        String descripcion,
        Boolean activo,
        @NotNull @Valid TipoMovimientoResponse tipoMov) {}
