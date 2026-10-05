package org.cbpersonalproject.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public record MovimientoRequest( @NotBlank String descripcion,
        @NotNull @Positive BigDecimal monto,
        @NotNull LocalDate fecha) {}
    
