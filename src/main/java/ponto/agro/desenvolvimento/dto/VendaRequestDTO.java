package ponto.agro.desenvolvimento.dto;

import java.util.List;

import jakarta.validation.constraints.NotEmpty;

public record VendaRequestDTO(
    @NotEmpty(message = "A venda não pode ser vazia")
    List<ItemVendaRequestDTO> itens
) {
}
