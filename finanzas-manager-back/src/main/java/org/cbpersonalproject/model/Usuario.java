package org.cbpersonalproject.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Table;

import java.time.OffsetDateTime;

@Table("usuario")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class Usuario {
    @Id
    private Long idUsuario;
    private String keycloakId;
    private String email;
    private String nombre;
    private String apellido;
    private OffsetDateTime fechaRegistro;
    private OffsetDateTime fechaUltimoLogin;
    private boolean activo;
}
