package ponto.agro.desenvolvimento.dto;

import ponto.agro.desenvolvimento.models.enums.PerfilOperador;

public record LoginResponseDTO(
    String token,
    Long operadorId,
    String nome,
    PerfilOperador perfil
) {
}
