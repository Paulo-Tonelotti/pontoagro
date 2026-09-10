package ponto.agro.desenvolvimento.exceptions;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.Instant;
import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    // 1. Captura erros disparados explicitamente pelo seu domínio (ex: código de barras duplicado, categoria inexistente)
    @ExceptionHandler(RegraDeNegocioException.class)
    public ResponseEntity<ErroResposta> tratarRegraDeNegocio(RegraDeNegocioException ex) {
        HttpStatus status = HttpStatus.CONFLICT;

        ErroResposta erro = new ErroResposta(
                Instant.now(),
                status.value(),
                "Violação de Regra de Negócio",
                ex.getMessage()
        );

        return ResponseEntity.status(status).body(erro);
    }

    // 2. Captura restrições do banco que escaparam (ex: integridade de chave estrangeira, constraints únicas)
    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<ErroResposta> tratarViolacaoIntegridade(DataIntegrityViolationException ex) {
        HttpStatus status = HttpStatus.CONFLICT;

        ErroResposta erro = new ErroResposta(
                Instant.now(),
                status.value(),
                "Conflito de Dados",
                "Operação não permitida por violação de integridade no banco de dados."
        );

        return ResponseEntity.status(status).body(erro);
    }

    // 3. Captura falhas de validação de campos (@NotBlank, @NotNull, @Positive, etc.) acionadas pelo @Valid
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, String>> tratarErrosDeValidacao(MethodArgumentNotValidException ex) {
        Map<String, String> erros = new HashMap<>();

        for (FieldError fieldError : ex.getBindingResult().getFieldErrors()) {
            erros.put(fieldError.getField(), fieldError.getDefaultMessage());
        }

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(erros);
    }
}