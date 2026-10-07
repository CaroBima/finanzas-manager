BEGIN;

INSERT INTO tipo_movimiento (nombre, naturaleza) VALUES
  ('Ingresos generales', 'I'),
  ('Gastos fijos',       'E'),
  ('Servicios',          'E'),
  ('Tarjeta',            'E'),
  ('Préstamos',          'E')
ON CONFLICT (nombre) DO NOTHING;

INSERT INTO movimiento (id_tipo_movimiento, nombre, activo)
SELECT t.id_tipo_movimiento, v.nombre, true
FROM (VALUES
  ('Ingresos generales', 'Sueldo'),
  ('Ingresos generales', 'Freelance'),
  ('Gastos fijos',       'Alquiler'),
  ('Servicios',          'Supermercado'),
  ('Servicios',          'Luz'),
  ('Servicios',          'Internet'),
  ('Tarjeta',            'Tarjeta Visa'),
  ('Préstamos',          'Préstamo Banco')
) AS v(tipo, nombre)
JOIN tipo_movimiento t ON t.nombre = v.tipo
ON CONFLICT (nombre) DO NOTHING;

INSERT INTO periodo (anio, mes) VALUES
  (2025, 10),
  (2025, 11),
  (2025, 12),
  (2026, 1),
  (2026, 2),
  (2026, 3)
ON CONFLICT (anio, mes) DO NOTHING;

WITH datos (anio, mes, nombre_mov, previsto, real, nro_cuota, total_cuotas) AS (
  VALUES
  (2025, 10, 'Sueldo',         350000.00, 350000.00, NULL::SMALLINT, NULL::SMALLINT),
  (2025, 10, 'Freelance',       80000.00,  65000.00, NULL,           NULL),
  (2025, 10, 'Alquiler',       120000.00, 120000.00, NULL,           NULL),
  (2025, 10, 'Supermercado',    85000.00,  91200.00, NULL,           NULL),
  (2025, 10, 'Luz',             12000.00,  13500.00, NULL,           NULL),
  (2025, 10, 'Internet',         8500.00,   8500.00, NULL,           NULL),
  (2025, 10, 'Tarjeta Visa',    55000.00,  62300.00, NULL,           NULL),
  (2025, 10, 'Préstamo Banco',  40000.00,  40000.00, 4,              12),

  (2025, 11, 'Sueldo',         350000.00, 350000.00, NULL,           NULL),
  (2025, 11, 'Freelance',       60000.00,  72000.00, NULL,           NULL),
  (2025, 11, 'Alquiler',       120000.00, 120000.00, NULL,           NULL),
  (2025, 11, 'Supermercado',    90000.00,  88000.00, NULL,           NULL),
  (2025, 11, 'Luz',             11000.00,  10800.00, NULL,           NULL),
  (2025, 11, 'Internet',         8500.00,   8500.00, NULL,           NULL),
  (2025, 11, 'Tarjeta Visa',    65000.00,  71200.00, NULL,           NULL),
  (2025, 11, 'Préstamo Banco',  40000.00,  40000.00, 5,              12),

  (2025, 12, 'Sueldo',         700000.00, 700000.00, NULL,           NULL),
  (2025, 12, 'Freelance',       50000.00,  48000.00, NULL,           NULL),
  (2025, 12, 'Alquiler',       120000.00, 120000.00, NULL,           NULL),
  (2025, 12, 'Supermercado',   130000.00, 145000.00, NULL,           NULL),
  (2025, 12, 'Luz',             15000.00,  16200.00, NULL,           NULL),
  (2025, 12, 'Internet',         8500.00,   8500.00, NULL,           NULL),
  (2025, 12, 'Tarjeta Visa',    80000.00,  95000.00, NULL,           NULL),
  (2025, 12, 'Préstamo Banco',  40000.00,  40000.00, 6,              12),

  (2026,  1, 'Sueldo',         370000.00, 370000.00, NULL,           NULL),
  (2026,  1, 'Freelance',       70000.00,  55000.00, NULL,           NULL),
  (2026,  1, 'Alquiler',       130000.00, 130000.00, NULL,           NULL),
  (2026,  1, 'Supermercado',    90000.00,  87500.00, NULL,           NULL),
  (2026,  1, 'Luz',             18000.00,  19800.00, NULL,           NULL),
  (2026,  1, 'Internet',         9200.00,   9200.00, NULL,           NULL),
  (2026,  1, 'Tarjeta Visa',    70000.00,  68000.00, NULL,           NULL),
  (2026,  1, 'Préstamo Banco',  40000.00,  40000.00, 7,              12),

  (2026,  2, 'Sueldo',         370000.00, 370000.00, NULL,           NULL),
  (2026,  2, 'Freelance',       90000.00, 110000.00, NULL,           NULL),
  (2026,  2, 'Alquiler',       130000.00, 130000.00, NULL,           NULL),
  (2026,  2, 'Supermercado',    85000.00,  82000.00, NULL,           NULL),
  (2026,  2, 'Luz',             19000.00,  20500.00, NULL,           NULL),
  (2026,  2, 'Internet',         9200.00,   9200.00, NULL,           NULL),
  (2026,  2, 'Tarjeta Visa',    60000.00,  58000.00, NULL,           NULL),
  (2026,  2, 'Préstamo Banco',  40000.00,  40000.00, 8,              12),

  (2026,  3, 'Sueldo',         370000.00, 370000.00, NULL,           NULL),
  (2026,  3, 'Freelance',       65000.00,  72000.00, NULL,           NULL),
  (2026,  3, 'Alquiler',       130000.00, 130000.00, NULL,           NULL),
  (2026,  3, 'Supermercado',    92000.00,  95000.00, NULL,           NULL),
  (2026,  3, 'Luz',             14000.00,  13800.00, NULL,           NULL),
  (2026,  3, 'Internet',         9200.00,   9200.00, NULL,           NULL),
  (2026,  3, 'Tarjeta Visa',    75000.00,  80000.00, NULL,           NULL),
  (2026,  3, 'Préstamo Banco',  40000.00,  40000.00, 9,              12)
)
INSERT INTO movimiento_mensual (id_periodo, id_movimiento, monto_previsto, monto_real, nro_cuota, total_cuotas)
SELECT
  p.id_periodo,
  m.id_movimiento,
  d.previsto,
  d.real,
  d.nro_cuota,
  d.total_cuotas
FROM datos d
JOIN periodo p   ON p.anio = d.anio AND p.mes = d.mes
JOIN movimiento m ON m.nombre = d.nombre_mov
ON CONFLICT (id_periodo, id_movimiento) DO NOTHING;

COMMIT;
