package ponto.agro.desenvolvimento.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import ponto.agro.desenvolvimento.models.Venda;
import ponto.agro.desenvolvimento.models.enums.FormaPagamento;
import ponto.agro.desenvolvimento.models.enums.StatusVenda;

public record VendaResponseDTO(
    Long id,
    BigDecimal subtotal,
    BigDecimal desconto,
    BigDecimal acrescimo,
    BigDecimal valorTotal,
    FormaPagamento formaPagamento,
    BigDecimal valorRecebido,
    BigDecimal troco,
    Long clienteId,
    String clienteNome,
    Long atendenteId,
    String atendenteNome,
    LocalDateTime dataVenda,
    StatusVenda status,
    List<ItemVendaResponseDTO> itens
) {
    public VendaResponseDTO(Venda venda) {
        this(
            venda.getId(),
            venda.getValorTotal().add(venda.getDesconto()).subtract(venda.getAcrescimo()),
            venda.getDesconto(),
            venda.getAcrescimo(),
            venda.getValorTotal(),
            venda.getFormaPagamento(),
            venda.getValorRecebido(),
            venda.getTroco(),
            venda.getCliente() != null ? venda.getCliente().getId() : null,
            venda.getCliente() != null ? venda.getCliente().getNome() : null,
            venda.getAtendente() != null ? venda.getAtendente().getId() : null,
            venda.getAtendente() != null ? venda.getAtendente().getNome() : null,
            venda.getDataVenda(),
            venda.getStatus(),
            venda.getItens().stream().map(ItemVendaResponseDTO::new).toList()
        );
    }
}
