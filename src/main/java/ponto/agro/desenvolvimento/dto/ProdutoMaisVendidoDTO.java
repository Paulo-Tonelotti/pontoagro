package ponto.agro.desenvolvimento.dto;

import java.math.BigDecimal;

public record ProdutoMaisVendidoDTO(
    Long produtoId,
    String produtoNome,
    long quantidadeVendida,
    BigDecimal valorTotal
) {
}
