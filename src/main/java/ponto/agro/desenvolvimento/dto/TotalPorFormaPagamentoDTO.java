package ponto.agro.desenvolvimento.dto;

import java.math.BigDecimal;
import ponto.agro.desenvolvimento.models.enums.FormaPagamento;

public record TotalPorFormaPagamentoDTO(
    FormaPagamento formaPagamento,
    BigDecimal total
) {
}
