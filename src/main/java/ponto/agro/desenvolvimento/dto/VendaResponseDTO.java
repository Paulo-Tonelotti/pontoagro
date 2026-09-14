package ponto.agro.desenvolvimento.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import ponto.agro.desenvolvimento.models.Venda;
import ponto.agro.desenvolvimento.models.enums.StatusVenda;

public record VendaResponseDTO(
    Long id,
    BigDecimal valorTotal,
    LocalDateTime dataVenda,
    StatusVenda status,
    List<ItemVendaResponseDTO> itens
) {
    public VendaResponseDTO(Venda venda){
        this(venda.getId(), 
        venda.getValorTotal(), 
        venda.getDataVenda(), 
        venda.getStatus(), 
        venda.getItens().stream().map(ItemVendaResponseDTO::new).toList());
    }
} 