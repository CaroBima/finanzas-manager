package org.cbpersonalproject.model;


import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Table;

@Table("movimiento_mensual")
public class MovimientoMensual {
    @Id
    int idMovimientoMensual;
    int idPeriodo;
    int idMovimiento;
    double montoPrevisto;
    double montoReal;
    int nroCuota;
    int totalCuotas;
    String notas;
}
