package ponto.agro.desenvolvimento.exceptions;

public class NaoAutorizadoException extends RuntimeException {
    public NaoAutorizadoException(String mensagem) {
        super(mensagem);
    }
}
