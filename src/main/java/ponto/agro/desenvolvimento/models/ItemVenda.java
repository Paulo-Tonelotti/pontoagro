package ponto.agro.desenvolvimento.models;

import java.math.BigDecimal;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

@Entity
@Table(name = "tb_item_venda")
public class ItemVenda {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(nullable = false)
    @NotNull(message = "A venda é obrigatória")
    private Venda venda;

    @ManyToOne
    @JoinColumn(nullable = false)
    @NotNull(message = "Um produto deve ser informado")
    private Produto produto;

    @NotNull(message = "A quantidade é obrigatoria")
    @Positive(message = "A quantidade deve ser positiva")
    @Column(nullable = false)
    private Integer quantidade;

    @NotNull(message = "A preco unitário é obrigatorio")
    @Positive(message = "O preço deve ser positivo")
    @Column(nullable = false)
    private BigDecimal precoUnitario;


    public BigDecimal calcularSubtotal() {
    if (this.precoUnitario == null || this.quantidade == null) {
        return BigDecimal.ZERO;
    }
    return this.precoUnitario.multiply(BigDecimal.valueOf(this.quantidade));
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Venda getVenda() {
        return venda;
    }

    public void setVenda(Venda venda) {
        this.venda = venda;
    }

    public Produto getProduto() {
        return produto;
    }

    public void setProduto(Produto produto) {
        this.produto = produto;
    }

    public Integer getQuantidade() {
        return quantidade;
    }

    public void setQuantidade(Integer quantidade) {
        this.quantidade = quantidade;
    }

    public BigDecimal getPrecoUnitario() {
        return precoUnitario;
    }

    public void setPrecoUnitario(BigDecimal precoUnitario) {
        this.precoUnitario = precoUnitario;
    }


    
}
