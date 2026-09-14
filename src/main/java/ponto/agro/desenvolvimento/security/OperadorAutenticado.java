package ponto.agro.desenvolvimento.security;

public class OperadorAutenticado {

    private static final ThreadLocal<OperadorContexto> CONTEXTO = new ThreadLocal<>();

    private OperadorAutenticado() {
    }

    public static void definir(OperadorContexto contexto) {
        CONTEXTO.set(contexto);
    }

    public static OperadorContexto obter() {
        return CONTEXTO.get();
    }

    public static void limpar() {
        CONTEXTO.remove();
    }
}
