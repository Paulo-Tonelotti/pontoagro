package ponto.agro.desenvolvimento.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;
import ponto.agro.desenvolvimento.models.enums.UnidadeMedida;

public record ProdutoRequestDTO(
    @NotBlank(message = "O nome é obrigatório")
    String nome,
    @NotNull(message = "O preço é obrigatório")
    @Positive(message = "O preço deve ser maior que zero")
    BigDecimal preco,
    @NotNull(message = "A quantidade é obrigatória")
    @PositiveOrZero(message = "A quantidade deve ser positiva ou zero")
    Integer quantidade,
    @NotNull(message = "A data de validade é obrigatória")
    @Future(message = "A data de validade deve ser uma data futura")
    LocalDate dataValidade,
    @NotNull(message = "A unidade de medida é obrigatória")
    UnidadeMedida unidadeMedida,
    @NotBlank(message = "O código de barras é obrigatório")
    String codigoBarra,
    @NotNull(message = "A categoria é obrigatória")
    Long categoriaId
) {
} 