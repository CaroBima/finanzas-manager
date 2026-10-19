package org.cbpersonalproject.listener;

import lombok.RequiredArgsConstructor;
import org.cbpersonalproject.config.RabbitMQConfig;
import org.cbpersonalproject.dto.MovimientoMensualResponse;
import org.cbpersonalproject.utils.Constantes;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.data.redis.core.ReactiveRedisTemplate;
import org.springframework.stereotype.Component;

@RequiredArgsConstructor
@Component
public class MovimientoMensualListener {
    private final ReactiveRedisTemplate reactiveRedisTemplate;

    /**
     * Al guardarse un nuevo movimiento borra el caché del importe total
     * para que no se muestre desactualizado
     * @param movimientoMensualResponse
     */
    @RabbitListener(queues= RabbitMQConfig.QUEUE_MOVIMIENTO)
    public void onNuevoMovimiento(MovimientoMensualResponse movimientoMensualResponse){
        Integer mes =  movimientoMensualResponse.periodoResponse().mes();
        Integer anio =  movimientoMensualResponse.periodoResponse().anio();
        final String CACHE_KEY = Constantes.CACHE_KEY_MOVIMIENTOS_MENSUALES + mes + ":" + anio;
        final String CACHE_KEY_3_MESES = Constantes.CACHE_KEY_MOVIMIENTOS_MENSUALES + "ultimos-3-meses"
        reactiveRedisTemplate.delete(CACHE_KEY, CACHE_KEY_3_MESES)
                .subscribe();

    }
}
