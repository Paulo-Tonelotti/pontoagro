package ponto.agro.desenvolvimento.dto;

import java.math.BigDecimal;
import java.util.List;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import ponto.agro.desenvolvimento.models.enums.FormaPagamento;

public record VendaRequestDTO(
    @NotEmpty(message = "A venda não pode ser vazia")
    List<ItemVendaRequestDTO> itens,
    @NotNull(message = "A forma de pagamento é obrigatória")
    FormaPagamento formaPagamento,
    @PositiveOrZero(message = "O desconto deve ser positivo ou zero")
    BigDecimal desconto,
    @PositiveOrZero(message = "O acréscimo deve ser positivo ou zero")
    BigDecimal acrescimo,
    BigDecimal valorRecebido,
    Long clienteId
) {
}
