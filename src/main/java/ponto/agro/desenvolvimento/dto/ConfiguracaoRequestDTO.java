package ponto.agro.desenvolvimento.dto;

public record ConfiguracaoRequestDTO(
    String nomeComercio,
    String endereco,
    String telefone,
    String cnpj,
    String ie,
    boolean usarLeitorPadrao
) {
}
