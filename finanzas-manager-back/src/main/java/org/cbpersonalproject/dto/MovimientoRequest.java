package org.cbpersonalproject.dto;

import java.math.BigDecimal;

import jakarta.validation.constraints.*;


public record MovimientoRequest(
        @NotBlank
        String nombreMovimiento,

        String descripcionMovimiento,

        @NotNull
        @PositiveOrZero
        BigDecimal montoPrevisto,

        @PositiveOrZero
        BigDecimal montoReal,

        @Positive
        Integer nroCuota,

        @Positive
        Integer totalCuotas,

        String notas,

        @NotBlank
        String tipoMovimiento,

        @NotBlank
        String naturaleza,

        @NotNull
        @Min(1)
        @Max(12)
        Integer mes,

        @NotNull
        @Min(2000)
        Integer anio
) {}