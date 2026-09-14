package ponto.agro.desenvolvimento.dto;

import jakarta.validation.constraints.NotBlank;

public record CategoriaRequestDTO(
    @NotBlank(message = "O nome é obrigatório")
    String nome,
    @NotBlank(message = "A descrição é obrigatória")
    String descricao
) {
}
