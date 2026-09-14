package ponto.agro.desenvolvimento.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import ponto.agro.desenvolvimento.models.enums.PerfilOperador;

public record OperadorRequestDTO(
    @NotBlank(message = "O nome é obrigatório")
    String nome,
    @NotBlank(message = "O login é obrigatório")
    String login,
    @NotBlank(message = "A senha é obrigatória")
    @Size(min = 4, message = "A senha deve ter ao menos 4 caracteres")
    String senha,
    @NotNull(message = "O perfil é obrigatório")
    PerfilOperador perfil
) {
}
