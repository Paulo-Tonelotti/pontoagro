package ponto.agro.desenvolvimento.dto;

import ponto.agro.desenvolvimento.models.Cliente;

public record ClienteResponseDTO(
    Long id,
    String nome,
    String documento,
    String telefone,
    String endereco
) {
    public ClienteResponseDTO(Cliente cliente) {
        this(cliente.getId(), cliente.getNome(), cliente.getDocumento(), cliente.getTelefone(), cliente.getEndereco());
    }
}
