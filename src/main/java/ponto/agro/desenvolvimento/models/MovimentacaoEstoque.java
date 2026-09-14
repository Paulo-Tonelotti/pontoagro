package ponto.agro.desenvolvimento.models;

import java.time.LocalDateTime;

import jakarta.persistence.*;
import ponto.agro.desenvolvimento.models.enums.TipoMovimentacaoEstoque;

@Entity
@Table(name = "tb_movimentacao_estoque")
public class MovimentacaoEstoque {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "produto_id", nullable = false)
    private Produto produto;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TipoMovimentacaoEstoque tipo;

    @Column(nullable = false)
    private Integer quantidade;

    @Column(nullable = false)
    private LocalDateTime dataMovimentacao;

    private String observacao;

    private Long vendaId;

    @ManyToOne
    @JoinColumn(name = "operador_id")
    private Operador operador;

    @PrePersist
    public void definirData() {
        this.dataMovimentacao = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Produto getProduto() {
        return produto;
    }

    public void setProduto(Produto produto) {
        this.produto = produto;
    }

    public TipoMovimentacaoEstoque getTipo() {
        return tipo;
    }

    public void setTipo(TipoMovimentacaoEstoque tipo) {
        this.tipo = tipo;
    }

    public Integer getQuantidade() {
        return quantidade;
    }

    public void setQuantidade(Integer quantidade) {
        this.quantidade = quantidade;
    }

    public LocalDateTime getDataMovimentacao() {
        return dataMovimentacao;
    }

    public String getObservacao() {
        return observacao;
    }

    public void setObservacao(String observacao) {
        this.observacao = observacao;
    }

    public Long getVendaId() {
        return vendaId;
    }

    public void setVendaId(Long vendaId) {
        this.vendaId = vendaId;
    }

    public Operador getOperador() {
        return operador;
    }

    public void setOperador(Operador operador) {
        this.operador = operador;
    }
}
