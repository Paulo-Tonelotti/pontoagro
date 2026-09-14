package ponto.agro.desenvolvimento.dto;

import java.math.BigDecimal;

import ponto.agro.desenvolvimento.models.ItemVenda;

public record ItemVendaResponseDTO(
    Long produtoId,
    String produtoNome,
    Integer quantidade,
    BigDecimal precoUnitario,
    BigDecimal subtotal
) {
    public ItemVendaResponseDTO(ItemVenda itemVenda) {
        this(itemVenda.getProduto().getId(), 
            itemVenda.getProduto().getNome(), 
            itemVenda.getQuantidade(), 
            itemVenda.getPrecoUnitario(), 
            itemVenda.calcularSubtotal());
    }
}
