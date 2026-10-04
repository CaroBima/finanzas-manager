CREATE VIEW v_resumen_mensual AS
SELECT p.id_periodo,
       p.anio,
       p.mes,
       SUM(CASE WHEN t.naturaleza = 'E' THEN mm.monto_previsto ELSE 0 END) AS gastos_previstos,
       SUM(CASE WHEN t.naturaleza = 'I' THEN mm.monto_previsto ELSE 0 END) AS ingresos_previstos,
       SUM(CASE WHEN t.naturaleza = 'I' THEN mm.monto_previsto ELSE -mm.monto_previsto END) AS saldo_previsto,
       SUM(CASE WHEN t.naturaleza = 'E' THEN mm.monto_real ELSE 0 END)     AS gastos_reales,
       SUM(CASE WHEN t.naturaleza = 'I' THEN mm.monto_real ELSE 0 END)     AS ingresos_reales,
       SUM(CASE WHEN t.naturaleza = 'I' THEN mm.monto_real ELSE -mm.monto_real END) AS saldo_real
FROM periodo p
JOIN movimiento_mensual mm ON mm.id_periodo = p.id_periodo
JOIN movimiento m          ON m.id_movimiento = mm.id_movimiento
JOIN tipo_movimiento t     ON t.id_tipo_movimiento = m.id_tipo_movimiento
GROUP BY p.id_periodo, p.anio, p.mes;

CREATE VIEW v_resumen_escenario AS
SELECT e.id_escenario,
       e.id_periodo,
       e.nombre,
       SUM(CASE WHEN t.naturaleza = 'E' THEN d.monto ELSE 0 END) AS gastos,
       SUM(CASE WHEN t.naturaleza = 'I' THEN d.monto ELSE 0 END) AS ingresos,
       SUM(CASE WHEN t.naturaleza = 'I' THEN d.monto ELSE -d.monto END) AS saldo
FROM escenario e
JOIN escenario_detalle d ON d.id_escenario = e.id_escenario
JOIN movimiento m        ON m.id_movimiento = d.id_movimiento
JOIN tipo_movimiento t   ON t.id_tipo_movimiento = m.id_tipo_movimiento
GROUP BY e.id_escenario, e.id_periodo, e.nombre;
