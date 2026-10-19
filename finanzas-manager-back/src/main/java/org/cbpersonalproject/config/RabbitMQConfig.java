package org.cbpersonalproject.config;

import org.springframework.amqp.core.*;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;



@Configuration
public class RabbitMQConfig {
    public static final String QUEUE_MOVIMIENTO = "finanzas.movimiento.nuevo";
    public static final String EXCHANGE = "finanzas.exchange";
    public static final String ROUTING_KEY = "movimiento.nuevo";

    @Bean
    public Queue movimientoQueue() {
        return QueueBuilder.durable(QUEUE_MOVIMIENTO).build();
    }

    @Bean
    public DirectExchange exchange() {
        return new DirectExchange(EXCHANGE);
    }

    @Bean
    public Binding binding(Queue movimientoQueue, DirectExchange exchange){
        return BindingBuilder.bind(movimientoQueue).to(exchange).with(ROUTING_KEY);
    }
}
