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

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, String>> tratarErrosDeValidacao(MethodArgumentNotValidException ex) {
        Map<String, String> erros = new HashMap<>();

        for (FieldError fieldError : ex.getBindingResult().getFieldErrors()) {
            erros.put(fieldError.getField(), fieldError.getDefaultMessage());
        }

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(erros);
    }

    @ExceptionHandler(RecursoNaoEncontradoException.class)
    public ResponseEntity<ErroResposta> tratarRecursoNaoEcontrado(RecursoNaoEncontradoException ex) {
        HttpStatus status = HttpStatus.NOT_FOUND;
        ErroResposta erro = new ErroResposta(
                Instant.now(),
                status.value(),
                "Recurso não encontrado",
                ex.getMessage()
        );

        return ResponseEntity.status(status).body(erro);
    }

    @ExceptionHandler(NaoAutorizadoException.class)
    public ResponseEntity<ErroResposta> tratarNaoAutorizado(NaoAutorizadoException ex) {
        HttpStatus status = HttpStatus.UNAUTHORIZED;
        ErroResposta erro = new ErroResposta(
                Instant.now(),
                status.value(),
                "Não autorizado",
                ex.getMessage()
        );

        return ResponseEntity.status(status).body(erro);
    }

    @ExceptionHandler(AcessoNegadoException.class)
    public ResponseEntity<ErroResposta> tratarAcessoNegado(AcessoNegadoException ex) {
        HttpStatus status = HttpStatus.FORBIDDEN;
        ErroResposta erro = new ErroResposta(
                Instant.now(),
                status.value(),
                "Acesso negado",
                ex.getMessage()
        );

        return ResponseEntity.status(status).body(erro);
    }
}