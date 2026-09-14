package ponto.agro.desenvolvimento.controller;

import java.net.URI;
import java.util.List;

import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import ponto.agro.desenvolvimento.dto.ClienteRequestDTO;
import ponto.agro.desenvolvimento.dto.ClienteResponseDTO;
import ponto.agro.desenvolvimento.services.ClienteService;

@RestController
@RequestMapping("/clientes")
public class ClienteController {

    private final ClienteService clienteService;

    public ClienteController(ClienteService clienteService) {
        this.clienteService = clienteService;
    }

    @PostMapping
    public ResponseEntity<ClienteResponseDTO> salvarCliente(@Valid @RequestBody ClienteRequestDTO clienteDto) {
        ClienteResponseDTO response = clienteService.salvar(clienteDto);

        URI uri = ServletUriComponentsBuilder
                .fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(response.id())
                .toUri();

        return ResponseEntity.created(uri).body(response);
    }

    @GetMapping
    public ResponseEntity<List<ClienteResponseDTO>> listarClientes() {
        return ResponseEntity.ok(clienteService.buscarTodos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ClienteResponseDTO> buscarCliente(@PathVariable Long id) {
        return ResponseEntity.ok(clienteService.buscarPorIdDto(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ClienteResponseDTO> atualizarCliente(@PathVariable Long id, @Valid @RequestBody ClienteRequestDTO clienteDto) {
        return ResponseEntity.ok(clienteService.atualizar(id, clienteDto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> removerCliente(@PathVariable Long id) {
        clienteService.deletar(id);
        return ResponseEntity.noContent().build();
    }
}
