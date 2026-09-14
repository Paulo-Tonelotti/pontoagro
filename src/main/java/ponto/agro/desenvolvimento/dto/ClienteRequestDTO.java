package ponto.agro.desenvolvimento.dto;

import jakarta.validation.constraints.NotBlank;

public record ClienteRequestDTO(
    @NotBlank(message = "O nome é obrigatório")
    String nome,
    String documento,
    String telefone,
    String endereco
) {
}
