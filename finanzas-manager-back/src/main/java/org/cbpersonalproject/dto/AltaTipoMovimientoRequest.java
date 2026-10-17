package org.cbpersonalproject.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public record AltaTipoMovimientoRequest(
        @NotBlank String nombre,
        @NotBlank @Pattern(regexp = "[IE]") String naturaleza) {}
