package ponto.agro.desenvolvimento.models;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import ponto.agro.desenvolvimento.models.enums.UnidadeMedida;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.util.Objects;

@Entity
@Table(name = "tb_produto")
public class Produto {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "O nome é obrigatório")
    @Column(nullable = false)
    private String nome;

    @NotNull(message = "O preço é obrigatório")
    @Positive(message = "O preço deve ser maior que zero")
    @Column(nullable = false)
    private BigDecimal preco;

    @NotNull(message = "A unidade de medida é obrigatória")
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private UnidadeMedida unidadeMedida;

    @Column(nullable = false, updatable = false)
    private Instant dataCadastro;

    @NotNull(message = "A data de validade é obrigatória")
    @Future(message = "A data de validade deve ser uma data futura")
    @Column(nullable = false)
    private LocalDate dataValidade;

    @NotNull(message = "A quantidade é obrigatória")
    @PositiveOrZero(message = "A quantidade deve ser positiva ou zero")
    @Column(nullable = false)
    private Integer quantidade;

    @NotBlank(message = "O código de barras é obrigatório")
    @Column(nullable = false, unique = true)
    private String codigoBarra;

    @NotNull(message = "A categoria é obrigatória")
    @ManyToOne
    @JoinColumn(name = "categoria_id", nullable = false)
    private Categoria categoria;

    public Produto() {}

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Categoria getCategoria() {
        return categoria;
    }

    public void setCategoria(Categoria categoria) {
        this.categoria = categoria;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public BigDecimal getPreco() {
        return preco;
    }

    public void setPreco(BigDecimal preco) {
        this.preco = preco;
    }

    public UnidadeMedida getUnidadeMedida() {
        return unidadeMedida;
    }

    public void setUnidadeMedida(UnidadeMedida unidadeMedida) {
        this.unidadeMedida = unidadeMedida;
    }

    public Instant getDataCadastro() {
        return dataCadastro;
    }

    @PrePersist
    public void setDataCadastro() {
        this.dataCadastro = Instant.now();
    }

    public LocalDate getDataValidade() {
        return dataValidade;
    }

    public void setDataValidade(LocalDate dataValidade) {
        this.dataValidade = dataValidade;
    }

    public Integer getQuantidade() {
        return quantidade;
    }

    public void setQuantidade(Integer quantidade) {
        this.quantidade = quantidade;
    }

    public String getCodigoBarra() {
        return codigoBarra;
    }

    public void setCodigoBarra(String codigoBarra) {
        this.codigoBarra = codigoBarra;
    }

    @Override
    public boolean equals(Object o) {
        if (o == null || getClass() != o.getClass()) return false;
        Produto produto = (Produto) o;
        return Objects.equals(id, produto.id);
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(id);
    }

}
