DROP VIEW IF EXISTS v_resumen_escenario;
DROP TABLE IF EXISTS escenario_detalle;
DROP TABLE IF EXISTS escenario;
ALTER TABLE movimiento_mensual ADD COLUMN monto_simulado NUMERIC(14,2) CHECK (monto_simulado >= 0);
