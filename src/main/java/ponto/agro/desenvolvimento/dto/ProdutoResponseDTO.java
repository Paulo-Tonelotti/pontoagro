package ponto.agro.desenvolvimento.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

import ponto.agro.desenvolvimento.models.Produto;
import ponto.agro.desenvolvimento.models.enums.UnidadeMedida;

public record ProdutoResponseDTO(
    Long id,
    String nome,
    BigDecimal preco,
    UnidadeMedida unidadeMedida,
    LocalDate dataValidade,
    Integer quantidade,
    String codigoBarra,
    Long categoriaId,
    String categoriaNome
) {
    public ProdutoResponseDTO(Produto produto) {
        this(
            produto.getId(), 
            produto.getNome(),
            produto.getPreco(),
            produto.getUnidadeMedida(), 
            produto.getDataValidade(), 
            produto.getQuantidade(),
            produto.getCodigoBarra(),
            produto.getCategoria() != null ? produto.getCategoria().getId() : null,
            produto.getCategoria() != null ? produto.getCategoria().getNome() : null
        );
    }
} 