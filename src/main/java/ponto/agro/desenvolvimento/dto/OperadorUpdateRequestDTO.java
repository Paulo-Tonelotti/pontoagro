package ponto.agro.desenvolvimento.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import ponto.agro.desenvolvimento.models.enums.PerfilOperador;

public record OperadorUpdateRequestDTO(
    @NotBlank(message = "O nome é obrigatório")
    String nome,
    @NotNull(message = "O perfil é obrigatório")
    PerfilOperador perfil,
    boolean ativo
) {
}
