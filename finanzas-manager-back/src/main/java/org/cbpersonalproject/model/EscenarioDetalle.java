package org.cbpersonalproject.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Table;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Table("escenario_detalle")
public class EscenarioDetalle {
    @Id
    private int idEscenarioDetalle;
    private int id_Escenario;
    private int id_Movimiento;
    private double monto;
}
