package org.cbpersonalproject.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Column;
import org.springframework.data.relational.core.mapping.Table;

@Table("movimiento")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class Movimiento {
    @Id
    private int idMovimiento;
    @Column("id_tipo_movimiento")
    private Integer idTipoMovimiento;
    private String nombre;
    private String descripcion;
    private Boolean activo;

}
