package org.cbpersonalproject.utils;

import java.time.Duration;

public class Constantes {
    public static final Duration CACHE_TTL = Duration.ofMinutes(10);
    public static final long CACHE_TTL_JITTER_SECONDS = 30;
    public static final String CACHE_KEY_MOVIMIENTO = "finanzas:movimiento:movimientoSelect";
    public static final String CACHE_KEY_MOVIMIENTOS_MENSUALES = "finanzas:movimientos:";
}
