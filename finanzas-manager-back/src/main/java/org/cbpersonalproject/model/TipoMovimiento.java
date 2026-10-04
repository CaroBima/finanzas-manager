package org.cbpersonalproject.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.relational.core.mapping.Table;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Table("tipo_movimiento")
public class TipoMovimiento {
    private int idTipoMovimiento;
    private String nombre;
    private String naturaleza;
}
