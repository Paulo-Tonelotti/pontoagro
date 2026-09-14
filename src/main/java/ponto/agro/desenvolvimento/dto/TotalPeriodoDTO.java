package ponto.agro.desenvolvimento.dto;

import java.math.BigDecimal;

public record TotalPeriodoDTO(
    BigDecimal totalVendido,
    long quantidadeVendas
) {
}
