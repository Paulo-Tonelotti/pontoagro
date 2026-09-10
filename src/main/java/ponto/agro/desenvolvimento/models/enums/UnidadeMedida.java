package ponto.agro.desenvolvimento.models.enums;

import com.fasterxml.jackson.annotation.JsonFormat;

@JsonFormat(shape = JsonFormat.Shape.OBJECT)
public enum UnidadeMedida {
    UN("UN", "Unidade"),
    KG("KG", "Quilograma"),
    L("L", "Litro"),
    SC("SC", "Saco"),
    CX("CX", "Caixa"),
    M("M", "Metro");

    private final String sigla;
    private final String descricao;

    UnidadeMedida(String sigla, String descricao) {
        this.sigla = sigla;
        this.descricao = descricao;
    }

    public String getSigla() {
        return sigla;
    }

    public String getDescricao() {
        return descricao;
    }
}