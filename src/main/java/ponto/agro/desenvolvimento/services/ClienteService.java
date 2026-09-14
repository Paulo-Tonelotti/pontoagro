package ponto.agro.desenvolvimento.services;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import ponto.agro.desenvolvimento.dto.ClienteRequestDTO;
import ponto.agro.desenvolvimento.dto.ClienteResponseDTO;
import ponto.agro.desenvolvimento.exceptions.RecursoNaoEncontradoException;
import ponto.agro.desenvolvimento.models.Cliente;
import ponto.agro.desenvolvimento.repositories.ClienteRepository;

@Service
public class ClienteService {

    private final ClienteRepository clienteRepository;

    public ClienteService(ClienteRepository clienteRepository) {
        this.clienteRepository = clienteRepository;
    }

    private void preencherDados(ClienteRequestDTO dto, Cliente cliente) {
        cliente.setNome(dto.nome());
        cliente.setDocumento(dto.documento());
        cliente.setTelefone(dto.telefone());
        cliente.setEndereco(dto.endereco());
    }

    @Transactional
    public ClienteResponseDTO salvar(ClienteRequestDTO dto) {
        Cliente cliente = new Cliente();
        preencherDados(dto, cliente);
        return new ClienteResponseDTO(clienteRepository.save(cliente));
    }

    @Transactional(readOnly = true)
    public List<ClienteResponseDTO> buscarTodos() {
        return clienteRepository.findAll().stream()
                .map(ClienteResponseDTO::new)
                .toList();
    }

    @Transactional(readOnly = true)
    public ClienteResponseDTO buscarPorIdDto(Long id) {
        return new ClienteResponseDTO(buscarPorId(id));
    }

    @Transactional(readOnly = true)
    public Cliente buscarPorId(Long id) {
        return clienteRepository.findById(id)
                .orElseThrow(() -> new RecursoNaoEncontradoException("O cliente com ID informado não foi encontrado"));
    }

    @Transactional
    public ClienteResponseDTO atualizar(Long id, ClienteRequestDTO dto) {
        Cliente cliente = buscarPorId(id);
        preencherDados(dto, cliente);
        return new ClienteResponseDTO(clienteRepository.save(cliente));
    }

    @Transactional
    public void deletar(Long id) {
        Cliente cliente = buscarPorId(id);
        clienteRepository.delete(cliente);
    }
}
