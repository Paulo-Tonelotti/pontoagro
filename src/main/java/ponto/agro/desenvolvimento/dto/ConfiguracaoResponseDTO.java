package ponto.agro.desenvolvimento.dto;

import ponto.agro.desenvolvimento.models.Configuracao;

public record ConfiguracaoResponseDTO(
    String nomeComercio,
    String endereco,
    String telefone,
    String cnpj,
    String ie,
    boolean usarLeitorPadrao
) {
    public ConfiguracaoResponseDTO(Configuracao configuracao) {
        this(
            configuracao.getNomeComercio(),
            configuracao.getEndereco(),
            configuracao.getTelefone(),
            configuracao.getCnpj(),
            configuracao.getIe(),
            configuracao.isUsarLeitorPadrao()
        );
    }
}
