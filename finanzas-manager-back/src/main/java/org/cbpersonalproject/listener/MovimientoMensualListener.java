package org.cbpersonalproject.listener;

import org.cbpersonalproject.config.RabbitMQConfig;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

@Component
public class MovimientoMensualListener {
    @RabbitListener(queues= RabbitMQConfig.QUEUE_MOVIMIENTO)
    public void onNuevoMovimiento(String mensaje){
        System.out.println("Mensaje recibido: " + mensaje);
    }
}
