package org.cbpersonalproject.service;

import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.ReactiveStringRedisTemplate;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

import java.time.Duration;

@Service
@RequiredArgsConstructor
public class TokenBlocklistService {

    private final ReactiveStringRedisTemplate redisTemplate;
    private static final String PREFIX = "blocklist:";

    public Mono<Void> block(String token, long ttlSeconds) {
        return redisTemplate.opsForValue()
                .set(PREFIX + token, "1", Duration.ofSeconds(ttlSeconds))
                .then();
    }

    public Mono<Boolean> isBlocked(String token) {
        return redisTemplate.hasKey(PREFIX + token);
    }
}
