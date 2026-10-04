package org.cbpersonalproject.model;


import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Table;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Table("movimiento_mensual")
public class MovimientoMensual {
    @Id
    private int idMovimientoMensual;
    private int idPeriodo;
    private int idMovimiento;
    private double montoPrevisto;
    private double montoReal;
    private int nroCuota;
    private int totalCuotas;
    private String notas;
}
