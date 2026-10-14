package org.cbpersonalproject.model;


import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Table;

import java.math.BigDecimal;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Table("movimiento_mensual")
public class MovimientoMensual {
    @Id
    private int idMovimientoMensual;
    private Periodo periodo;
    private Movimiento movimiento;
    private BigDecimal montoPrevisto;
    private BigDecimal montoReal;
    private int nroCuota;
    private int totalCuotas;
    private String notas;
}
