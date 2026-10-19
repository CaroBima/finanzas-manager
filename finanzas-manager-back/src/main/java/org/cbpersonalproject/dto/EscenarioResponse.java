package org.cbpersonalproject.dto;

import org.cbpersonalproject.model.Periodo;

import java.math.BigInteger;

public record EscenarioResponse (String nombre,
                                 String descripción,
                                 Periodo periodo) {}
