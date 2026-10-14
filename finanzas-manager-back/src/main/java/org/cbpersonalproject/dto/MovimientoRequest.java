package org.cbpersonalproject.dto;

import java.math.BigDecimal;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import org.cbpersonalproject.model.Periodo;
import org.cbpersonalproject.model.TipoMovimiento;

public record MovimientoRequest( @NotBlank String nombreMovimiento,
                                String descripcion,
                                 @NotNull @Positive BigDecimal montoPrevisto,
                                 @Positive BigDecimal montoReal,
                                 @Positive Integer nroCuota,
                                 @Positive Integer totalCuotas,
                                 String notas,
                                 @NotNull TipoMovimiento tipoMovimiento,
                                 @NotNull Periodo periodo) {}
    
