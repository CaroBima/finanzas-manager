package org.cbpersonalproject.config;


import org.springframework.amqp.core.*;
import org.springframework.amqp.rabbit.connection.CachingConnectionFactory;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.amqp.support.converter.JacksonJsonMessageConverter;
import org.springframework.amqp.support.converter.MessageConverter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import reactor.rabbitmq.RabbitFlux;
import reactor.rabbitmq.Sender;
import reactor.rabbitmq.SenderOptions;


@Configuration
public class RabbitMQConfig {
    public static final String QUEUE_MOVIMIENTO = "finanzas.movimiento_mensual.nuevo";
    public static final String EXCHANGE = "finanzas.exchange";
    public static final String ROUTING_KEY = "movimiento_mensual.nuevo";

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

    /**
     * Crea el conversor de mensajes que permite serializar objetos Java a JSON
     * y deserializar mensajes JSON a objetos Java al comunicarse con RabbitMQ.
     *
     * @return conversor de mensajes basado en Jackson
     */
    @Bean
    public MessageConverter messageConverter(){
        return new JacksonJsonMessageConverter();
    }

    /**
     * Configura el template utilizado para enviar y recibir mensajes mediante
     * RabbitMQ, utilizando el conversor JSON definido en la configuración.
     *
     * @param connectionFactory fábrica de conexiones con RabbitMQ
     * @param converter conversor utilizado para serializar y deserializar mensajes
     * @return template AMQP configurado con la conexión y el conversor de mensajes
     */
    @Bean
    public AmqpTemplate amqpTemplate(ConnectionFactory connectionFactory, MessageConverter converter){
        RabbitTemplate template = new RabbitTemplate(connectionFactory);
        template.setMessageConverter(converter);
        return template;
    }

    @Bean
    public Sender sender(ConnectionFactory connectionFactory) {
        com.rabbitmq.client.ConnectionFactory rabbitCf =
                ((CachingConnectionFactory) connectionFactory).getRabbitConnectionFactory();
        return RabbitFlux.createSender(new SenderOptions().connectionFactory(rabbitCf));
    }
}
