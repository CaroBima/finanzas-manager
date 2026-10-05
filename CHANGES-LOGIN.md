# Autenticación con Keycloak — Cambios realizados

Implementación de las HU [#2](https://github.com/CaroBima/finanzas-manager/issues/2) y [#14](https://github.com/CaroBima/finanzas-manager/issues/14).

---

## Flujo de punta a punta

```
1. Usuario abre la app → ProtectedRoute detecta que no hay token → redirige a /login

2. LoginPage muestra el botón "Iniciar sesión"
   → href apunta a: {API_BASE_URL}/oauth2/authorization/keycloak

3. Spring Security intercepta esa URL y redirige al browser hacia Keycloak
   → Keycloak muestra pantalla de login (o registro si es usuario nuevo)

4. Usuario se autentica (o se registra) en Keycloak
   → Keycloak redirige al backend: /login/oauth2/code/keycloak?code=...

5. Spring Security intercambia el code por tokens con Keycloak (internamente)
   → Llama al OAuth2LoginSuccessHandler

6. OAuth2LoginSuccessHandler (reactivo):
   a. AuthService crea o actualiza el usuario en PostgreSQL (R2DBC)
   b. Obtiene el access_token de Keycloak desde OAuth2AuthorizedClient
   c. Redirige al frontend: {FRONTEND_URL}/auth/callback?token={access_token}

7. AuthCallbackPage (frontend) lee el token del query param
   → Lo guarda en localStorage via login()
   → Navega a /periodo

8. Cada request a la API incluye: Authorization: Bearer {access_token}

9. TokenBlocklistFilter verifica primero que el token no esté en la blocklist de Redis

10. Spring Security Resource Server valida la firma del JWT contra la JWKS de Keycloak

11. POST /auth/logout:
    → Calcula el TTL restante del token
    → Lo agrega a la blocklist de Redis con ese TTL
    → Frontend limpia localStorage y redirige a /login
```

---

## Archivos nuevos

### Backend

| Archivo | Descripción |
|---|---|
| `db/migration/V3__create_usuario.sql` | Tabla `usuario` con keycloak_id, email, nombre, apellido, fechas y activo |
| `model/Usuario.java` | Entidad R2DBC mapeada a la tabla `usuario` |
| `repository/UsuarioRepository.java` | Repositorio reactivo con `findByKeycloakId` |
| `dto/UsuarioResponse.java` | Record con los datos públicos del usuario |
| `service/AuthService.java` | Crea o actualiza el usuario en la DB al hacer login |
| `service/TokenBlocklistService.java` | Guarda y consulta tokens revocados en Redis |
| `config/SecurityConfig.java` | Configura el SecurityWebFilterChain de WebFlux |
| `config/OAuth2LoginSuccessHandler.java` | Maneja el redirect post-login con el token |
| `config/TokenBlocklistFilter.java` | WebFilter que intercepta requests con tokens revocados |
| `controller/AuthController.java` | Endpoint POST /auth/logout |

### Frontend

| Archivo | Cambio |
|---|---|
| `context/AuthContext.tsx` | Eliminado MOCK_AUTH; logout llama a POST /auth/logout |
| `pages/LoginPage.tsx` | URL cambiada a /oauth2/authorization/keycloak; removido ícono de Google |

### Infraestructura

| Archivo | Cambio |
|---|---|
| `docker-compose.yml` | Agregado servicio keycloak; variables de entorno al backend |
| `docker/keycloak/realm-finanzas.json` | Realm finanzas con cliente preconfigurado y auto-registro habilitado |
| `docker/postgres/create-keycloak-db.sh` | Script de init que crea la DB keycloak en PostgreSQL |
| `finanzas-manager-back/pom.xml` | spring-boot-starter-security, oauth2-client, oauth2-resource-server |
| `finanzas-manager-back/application.properties` | Properties de Keycloak y frontend-url |
| `.env` | Variables locales: KEYCLOAK_ADMIN_PASSWORD, KEYCLOAK_CLIENT_SECRET |
| `.gitignore` | Agregado .env |

---

## Cómo levantar el entorno

Si el volumen de PostgreSQL ya existe hay que recrearlo para que se cree la base `keycloak`:

```bash
docker compose down -v
docker compose up -d
```

Keycloak tarda ~60 segundos en estar listo. Para ver el progreso:

```bash
docker compose logs -f keycloak
```

La consola de administración queda disponible en `http://localhost:8080`
con usuario `admin` y la contraseña definida en `.env`.

---

## Variables de entorno requeridas (archivo `.env`)

```
KEYCLOAK_ADMIN_PASSWORD=...       # contraseña del admin de Keycloak
KEYCLOAK_CLIENT_SECRET=...        # debe coincidir con realm-finanzas.json
```

El `KEYCLOAK_CLIENT_SECRET` en `.env` debe ser el mismo valor que el campo `"secret"` dentro de `docker/keycloak/realm-finanzas.json`.
