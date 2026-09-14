package ponto.agro.desenvolvimento.dto;

import java.time.LocalDateTime;

import ponto.agro.desenvolvimento.models.MovimentacaoEstoque;
import ponto.agro.desenvolvimento.models.enums.TipoMovimentacaoEstoque;

public record MovimentacaoEstoqueResponseDTO(
    Long id,
    TipoMovimentacaoEstoque tipo,
    Integer quantidade,
    LocalDateTime dataMovimentacao,
    String observacao,
    Long vendaId,
    String operadorNome
) {
    public MovimentacaoEstoqueResponseDTO(MovimentacaoEstoque movimentacao) {
        this(
            movimentacao.getId(),
            movimentacao.getTipo(),
            movimentacao.getQuantidade(),
            movimentacao.getDataMovimentacao(),
            movimentacao.getObservacao(),
            movimentacao.getVendaId(),
            movimentacao.getOperador() != null ? movimentacao.getOperador().getNome() : null
        );
    }
}
