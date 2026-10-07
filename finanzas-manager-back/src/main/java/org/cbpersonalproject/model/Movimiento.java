package org.cbpersonalproject.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Table;

@Table("movimiento")
@AllArgsConstructor
@Getter
@Setter
public class Movimiento {
    @Id
    private int idMovimiento;
    private int idTipoMovimiento;
    private String nombre;
    private String descripcion;
    private Boolean activo;

}
