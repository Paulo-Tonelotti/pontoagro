package ponto.agro.desenvolvimento.exceptions;

import java.time.Instant;

public record ErroResposta(
        Instant timestamp,
        Integer status,
        String erro,
        String mensagem
) {}