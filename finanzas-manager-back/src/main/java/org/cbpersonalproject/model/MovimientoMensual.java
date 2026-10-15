package org.cbpersonalproject.model;


import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Column;
import org.springframework.data.relational.core.mapping.Table;

import java.math.BigDecimal;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Table("movimiento_mensual")
public class MovimientoMensual {
    @Id
    private int idMovimientoMensual;
    @Column("id_periodo")
    private Integer idPeriodo;
    @Column("id_movimiento")
    private Integer idMovimiento;
    private BigDecimal montoPrevisto;
    private BigDecimal montoReal;
    private Integer nroCuota;
    private Integer totalCuotas;
    private String notas;
}
