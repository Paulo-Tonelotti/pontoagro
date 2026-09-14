package ponto.agro.desenvolvimento.dto;

import ponto.agro.desenvolvimento.models.Categoria;

public record CategoriaResponseDTO(
    Long id,
    String nome,
    String descricao
) {
    public CategoriaResponseDTO(Categoria categoria) {
        this(
            categoria.getId(),
            categoria.getNome(),
            categoria.getDescricao()
        );
    }
}
