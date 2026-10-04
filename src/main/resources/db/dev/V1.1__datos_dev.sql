INSERT INTO tipo_movimiento (nombre, naturaleza) VALUES
  ('Gasto fijo', 'E'), ('Servicios', 'E'), ('Tarjeta', 'E'), ('Préstamo', 'E'),
  ('Sueldo', 'I'), ('Inversión', 'I'), ('Otros ingresos', 'I');

INSERT INTO movimiento (id_tipo_movimiento, nombre) VALUES
  (1, 'expensas'), (2, 'luz'), (3, 'naranja'), (4, 'Préstamo galicia 1'),
  (5, 'sueldo'), (6, 'fondo fima');

INSERT INTO periodo (anio, mes) VALUES (2025, 10);

INSERT INTO movimiento_mensual (id_periodo, id_movimiento, monto_previsto, monto_real, nro_cuota, total_cuotas) VALUES
  (1, 1,  155193.00,  155193.00, NULL, NULL),
  (1, 2,  154018.50,  154018.50, NULL, NULL),
  (1, 3, 3900000.00, 3965062.19, NULL, NULL),
  (1, 4,  189543.91,  189543.91, 9, 12),
  (1, 5, 5276696.00, 5276696.00, NULL, NULL),
  (1, 6,       NULL,  269656.00, NULL, NULL);

INSERT INTO escenario (id_periodo, nombre) VALUES (1, 'Solo tarjeta y préstamo');
INSERT INTO escenario_detalle (id_escenario, id_movimiento, monto) VALUES
  (1, 3, 11965062.19), (1, 4, 189543.91), (1, 5, 5276696.00), (1, 6, 1173000.00);
