package ponto.agro.desenvolvimento.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public record ItemVendaRequestDTO(
    @NotNull(message = "O id do produto é obrigatório")
    Long produtoId,
    @NotNull(message = "A quantidade é obrigatória")
    @Positive(message = "A quantidade deve ser positiva")
    Integer quantidade
) {
    
}
