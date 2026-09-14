package ponto.agro.desenvolvimento.dto;

import ponto.agro.desenvolvimento.models.Operador;
import ponto.agro.desenvolvimento.models.enums.PerfilOperador;

public record OperadorResponseDTO(
    Long id,
    String nome,
    String login,
    PerfilOperador perfil,
    boolean ativo
) {
    public OperadorResponseDTO(Operador operador) {
        this(operador.getId(), operador.getNome(), operador.getLogin(), operador.getPerfil(), operador.isAtivo());
    }
}
