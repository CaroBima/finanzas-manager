# Programación reactiva en la autenticación — Explicación

Este documento explica cada patrón reactivo usado en la implementación del login con Keycloak. El objetivo es entender no solo qué hace cada operador, sino por qué se eligió y qué pasaría si se usara el enfoque imperativo tradicional.

---

## 1. ¿Qué es `Mono<T>`?

`Mono<T>` es un tipo de Project Reactor que representa una secuencia asincrónica que puede emitir **cero o un** valor de tipo `T`, y luego completar o emitir un error.

No es lo mismo que un `Future` o un `Optional`:
- Un `Future` ya arrancó a ejecutarse cuando lo tenés en la mano.
- Un `Mono` es una **descripción** de lo que va a pasar — no ejecuta nada hasta que alguien se suscribe.

```java
Mono<Usuario> resultado = usuarioRepository.findByKeycloakId("abc");
// En este punto NO se hizo ninguna consulta a la base de datos.
// Solo cuando Spring se suscriba (al devolver el Mono desde el controller/service)
// se ejecuta la query.
```

Esto permite componer operaciones asincrónicas sin bloquear ningún hilo.

---

## 2. `map` vs `flatMap`

Esta es la distinción más importante del día a día en reactivo.

### `map`
Transforma el valor dentro del `Mono` con una función **sincrónica** que devuelve un valor simple (no reactivo).

```java
Mono<String> nombre = usuarioRepository.findByKeycloakId("abc")
    .map(usuario -> usuario.getNombre());
// findByKeycloakId devuelve Mono<Usuario>
// map transforma Usuario → String
// resultado: Mono<String>
```

### `flatMap`
Transforma el valor con una función que devuelve **otro `Mono`** (una operación reactiva). Aplana el `Mono<Mono<T>>` resultante en `Mono<T>`.

```java
Mono<Usuario> actualizado = usuarioRepository.findByKeycloakId("abc")
    .flatMap(usuario -> {
        usuario.setFechaUltimoLogin(OffsetDateTime.now());
        return usuarioRepository.save(usuario); // Mono<Usuario>
    });
```

Si usáramos `map` en lugar de `flatMap` acá, el resultado sería `Mono<Mono<Usuario>>` — un Mono que contiene otro Mono sin ejecutarlo. `flatMap` "desenvuelve" el Mono interno y conecta las dos operaciones en una sola cadena.

**Regla práctica:** si la función que pasás devuelve `Mono` o `Flux`, usá `flatMap`. Si devuelve un valor simple, usá `map`.

### En este proyecto

En `AuthService`:
```java
return usuarioRepository.findByKeycloakId(keycloakId)
    .flatMap(existing -> {
        existing.setFechaUltimoLogin(OffsetDateTime.now());
        return usuarioRepository.save(existing); // Mono<Usuario> → necesita flatMap
    })
```

En `OAuth2LoginSuccessHandler`:
```java
.map(OAuth2AuthorizedClient::getAccessToken)       // AccessToken (valor simple) → map
.map(accessToken -> accessToken.getTokenValue())   // String (valor simple) → map
.flatMap(token -> {
    // redirect devuelve Mono<Void> → flatMap
    exchange.getExchange().getResponse().setStatusCode(HttpStatus.FOUND);
    return exchange.getExchange().getResponse().setComplete();
})
```

---

## 3. `switchIfEmpty` y `Mono.defer`

### El problema
`findByKeycloakId` puede no encontrar ningún usuario. En ese caso emite un `Mono` **vacío** (sin elemento, sin error — solo completa). En reactivo no hay nulls: la ausencia de valor es un stream vacío.

Si usáramos `map` o `flatMap` sobre un Mono vacío, simplemente no se ejecutaría el código adentro — el Mono vacío se propagaría sin hacer nada.

### `switchIfEmpty`
Define qué hacer cuando el Mono de upstream está vacío:

```java
usuarioRepository.findByKeycloakId(keycloakId)
    .flatMap(existing -> actualizarUsuario(existing))
    .switchIfEmpty(Mono.defer(() -> crearUsuario()))
```

Si `findByKeycloakId` encuentra un usuario → entra al `flatMap`.
Si no encuentra nada → entra al `switchIfEmpty`.

### `Mono.defer`
`Mono.defer(() -> ...)` envuelve la creación del Mono en una función que se evalúa **solo cuando se suscribe**. Sin `defer`, el código dentro se ejecutaría inmediatamente al armar la cadena, incluso si después nunca se entra a esa rama.

```java
// Sin defer: new Usuario() se construye siempre, aunque el usuario ya exista
.switchIfEmpty(crearNuevoUsuario())

// Con defer: new Usuario() se construye solo si realmente hay que crearlo
.switchIfEmpty(Mono.defer(() -> crearNuevoUsuario()))
```

Para operaciones simples la diferencia es menor, pero es la forma idiomática y correcta de manejar efectos secundarios dentro de `switchIfEmpty`.

---

## 4. `then()` y `thenReturn()`

### `then()`
Descarta el elemento emitido y retorna `Mono<Void>`. Se usa cuando la cadena tiene que ejecutarse pero el resultado no importa para quien llama.

```java
// AuthService.processLogin devuelve Mono<Void>
// El caller solo necesita saber que terminó, no qué usuario quedó
return usuarioRepository.findByKeycloakId(keycloakId)
    .flatMap(...)
    .switchIfEmpty(...)
    .then(); // convierte Mono<Usuario> → Mono<Void>
```

### `then(Mono<T> other)`
Espera que el Mono de upstream complete y luego suscribe a `other`, emitiendo su valor.

```java
// En OAuth2LoginSuccessHandler:
authService.processLogin(oauth2User)          // Mono<Void>
    .then(authorizedClientRepository          // espera processLogin, luego carga el cliente
        .loadAuthorizedClient(...))            // Mono<OAuth2AuthorizedClient>
```

### `thenReturn(T value)`
Shortcut de `.then(Mono.just(value))`. Espera que upstream complete y emite un valor fijo.

```java
// En AuthController:
return tokenBlocklistService.block(jwt.getTokenValue(), ttl)
    .thenReturn(ResponseEntity.noContent().<Void>build());
// Espera que se guarde en Redis y emite el 204
```

---

## 5. `ServerHttpSecurity` vs `HttpSecurity`

Spring tiene dos versiones del sistema de seguridad:

| | MVC (Servlet) | WebFlux (Reactivo) |
|---|---|---|
| Configuración | `HttpSecurity` | `ServerHttpSecurity` |
| Resultado | `SecurityFilterChain` | `SecurityWebFilterChain` |
| Contexto | `HttpServletRequest` | `ServerWebExchange` |
| Handlers | `AuthenticationSuccessHandler` | `ServerAuthenticationSuccessHandler` |
| Thread model | Un hilo por request | Pocos hilos, muchos requests |

En WebFlux **no existe el contexto de Servlet**. Cada abstracción usa `ServerWebExchange` (que encapsula request + response reactivos) en lugar de `HttpServletRequest`/`HttpServletResponse`.

`SecurityWebFilterChain` se registra como un filtro reactivo en el `WebHttpHandlerBuilder` de Spring WebFlux, no en el `FilterChain` de Servlet.

---

## 6. `ServerAuthenticationSuccessHandler` — handlers reactivos

En MVC, un `AuthenticationSuccessHandler` es un método normal que recibe request y response y hace un redirect directo. En WebFlux, todo retorna `Mono<Void>`:

```java
// MVC (imperativo):
void onAuthenticationSuccess(HttpServletRequest req, HttpServletResponse res, Authentication auth) {
    res.sendRedirect("/home");
}

// WebFlux (reactivo):
Mono<Void> onAuthenticationSuccess(WebFilterExchange exchange, Authentication auth) {
    exchange.getExchange().getResponse().setStatusCode(HttpStatus.FOUND);
    exchange.getExchange().getResponse().getHeaders().setLocation(URI.create("/home"));
    return exchange.getExchange().getResponse().setComplete(); // Mono<Void>
}
```

El `return` del handler reactivo es el `Mono<Void>` al que Spring se suscribe para ejecutar el redirect. Si no retornás nada (o retornás `Mono.empty()`), el redirect nunca ocurre.

### La cadena completa en `OAuth2LoginSuccessHandler`

```java
return authService.processLogin(oauth2User)          // 1. Crea/actualiza usuario en DB
    .then(authorizedClientRepository                  // 2. Carga el cliente autorizado de Keycloak
        .loadAuthorizedClient(registrationId,
            authentication, exchange.getExchange()))
    .map(OAuth2AuthorizedClient::getAccessToken)      // 3. Extrae el OAuth2AccessToken
    .map(accessToken -> accessToken.getTokenValue())  // 4. Extrae el String del token
    .flatMap(token -> {                               // 5. Hace el redirect (Mono<Void>)
        URI location = URI.create(frontendUrl + "/auth/callback?token=" + token);
        exchange.getExchange().getResponse().setStatusCode(HttpStatus.FOUND);
        exchange.getExchange().getResponse().getHeaders().setLocation(location);
        return exchange.getExchange().getResponse().setComplete();
    });
```

Cada paso se ejecuta en orden, de forma no bloqueante. Si cualquier paso falla, el error se propaga por la cadena y Spring Security lo maneja.

---

## 7. `ServerOAuth2AuthorizedClientRepository` — por qué no está en el `Authentication`

Después del login OAuth2, el `Authentication` contiene el `OAuth2User` (los claims del usuario: email, nombre, etc.), pero **no** el `access_token` de Keycloak.

El access token vive en el `OAuth2AuthorizedClient`, que Spring guarda por separado en el `ServerOAuth2AuthorizedClientRepository` (por defecto en la sesión web). Cargarlo es una operación asincrónica porque implica leer de la sesión:

```java
authorizedClientRepository.loadAuthorizedClient(
    registrationId,      // "keycloak"
    authentication,      // para identificar al usuario
    exchange.getExchange() // para acceder a la sesión
)
// retorna Mono<OAuth2AuthorizedClient>
```

Por eso usamos `.then(authorizedClientRepository.loadAuthorizedClient(...))` — espera que `processLogin` termine y luego hace esta consulta reactiva.

---

## 8. `ReactiveRedisTemplate` — operaciones asincrónicas sobre Redis

`ReactiveStringRedisTemplate` es la versión reactiva del cliente de Redis. Cada operación retorna un `Mono` o `Flux` en lugar de ejecutarse de forma bloqueante.

```java
// Imperativo (bloqueante — NO usar en WebFlux):
redisTemplate.opsForValue().set("key", "value");

// Reactivo (no bloqueante):
redisTemplate.opsForValue()
    .set("key", "value", Duration.ofSeconds(ttl))
    // retorna Mono<Boolean> — no se ejecuta hasta que alguien se suscribe
```

En `TokenBlocklistService`:

```java
public Mono<Void> block(String token, long ttlSeconds) {
    return redisTemplate.opsForValue()
        .set(PREFIX + token, "1", Duration.ofSeconds(ttlSeconds))
        .then(); // descarta el Boolean que devuelve set(), emite Mono<Void>
}

public Mono<Boolean> isBlocked(String token) {
    return redisTemplate.hasKey(PREFIX + token); // Mono<Boolean>
}
```

Si usáramos el `RedisTemplate` bloqueante dentro de un handler WebFlux, bloquearíamos el hilo de Netty — uno de los pocos hilos que maneja todos los requests simultáneos. Eso anularía completamente el beneficio de la programación reactiva.

---

## 9. `WebFilter` reactivo — interceptar requests

Un `WebFilter` en Spring WebFlux es el equivalente reactivo de un `Filter` de Servlet. La diferencia clave es que el método retorna `Mono<Void>`:

```java
// Servlet Filter (imperativo):
void doFilter(ServletRequest req, ServletResponse res, FilterChain chain) {
    chain.doFilter(req, res); // bloqueante
}

// WebFilter (reactivo):
Mono<Void> filter(ServerWebExchange exchange, WebFilterChain chain) {
    return chain.filter(exchange); // retorna Mono<Void>
}
```

En `TokenBlocklistFilter`, la decisión de continuar o bloquear es en sí reactiva porque requiere consultar Redis:

```java
return tokenBlocklistService.isBlocked(token)  // Mono<Boolean> — consulta Redis
    .flatMap(blocked -> {
        if (blocked) {
            exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
            return exchange.getResponse().setComplete(); // Mono<Void> — corta
        }
        return chain.filter(exchange); // Mono<Void> — continúa
    });
```

Se usa `flatMap` porque tanto `setComplete()` como `chain.filter(exchange)` retornan `Mono<Void>` — la elección entre las dos ramas es una operación reactiva.

---

## 10. `@AuthenticationPrincipal Mono<Jwt>` — principal reactivo

En Spring MVC, el principal se inyecta directamente:
```java
void logout(@AuthenticationPrincipal Jwt jwt) { ... }
```

En Spring WebFlux, el `SecurityContext` es reactivo — vive en el `SubscriberContext` del Reactor (no en un `ThreadLocal`). Por eso el principal se inyecta como `Mono<T>`:

```java
Mono<ResponseEntity<Void>> logout(@AuthenticationPrincipal Mono<Jwt> jwtMono) {
    return jwtMono.flatMap(jwt -> {
        // acá tenemos el Jwt real
    });
}
```

Spring resuelve el `Mono<Jwt>` desde el `ReactiveSecurityContextHolder` cuando el handler del controller se suscribe. El `Jwt` contiene tanto los claims (email, expiración) como el token crudo (`getTokenValue()`).

---

## Resumen de operadores usados

| Operador | Cuándo usarlo |
|---|---|
| `map` | Transformar un valor con una función sincrónica |
| `flatMap` | Transformar un valor con una función que retorna `Mono`/`Flux` |
| `switchIfEmpty` | Definir una alternativa cuando el Mono upstream está vacío |
| `Mono.defer` | Diferir la creación del Mono hasta el momento de suscripción |
| `then()` | Descartar el resultado y retornar `Mono<Void>` |
| `then(Mono<T>)` | Encadenar un segundo Mono que se ejecuta al completar el primero |
| `thenReturn(T)` | Esperar que upstream complete y emitir un valor fijo |
