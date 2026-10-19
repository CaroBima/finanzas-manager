package org.cbpersonalproject.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.cbpersonalproject.dto.PeriodoResponse;
import org.cbpersonalproject.repository.PeriodoRepository;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;

@Slf4j
@Service
@RequiredArgsConstructor
public class PeriodoService {

    public Flux<PeriodoResponse> buscarTodos() {
        return null;
    }
}
