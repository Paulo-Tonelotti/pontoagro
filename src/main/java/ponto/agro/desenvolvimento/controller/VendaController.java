package ponto.agro.desenvolvimento.controller;

import java.net.URI;
import java.time.LocalDate;
import java.util.List;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import jakarta.validation.Valid;
import ponto.agro.desenvolvimento.dto.VendaRequestDTO;
import ponto.agro.desenvolvimento.dto.VendaResponseDTO;
import ponto.agro.desenvolvimento.services.VendaService;

@RestController
@RequestMapping("/vendas")
public class VendaController {

    private final VendaService vendaService;

    public VendaController(VendaService vendaService) {
        this.vendaService = vendaService;
    }

    @PostMapping
    public ResponseEntity<VendaResponseDTO> salvarVenda(@Valid @RequestBody VendaRequestDTO vendaRequestDTO) {
        VendaResponseDTO response = vendaService.salvar(vendaRequestDTO);

        URI uri = ServletUriComponentsBuilder
                .fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(response.id())
                .toUri();
        return ResponseEntity.created(uri).body(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<VendaResponseDTO> buscar(@PathVariable Long id) {
        VendaResponseDTO response = vendaService.buscarPorIdDto(id);
        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<List<VendaResponseDTO>> listar(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dataInicio,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dataFim,
            @RequestParam(required = false) Long clienteId,
            @RequestParam(required = false) Long atendenteId) {
        List<VendaResponseDTO> vendas = vendaService.listar(dataInicio, dataFim, clienteId, atendenteId);
        return ResponseEntity.ok(vendas);
    }

    @PatchMapping("/{id}/cancelar")
    public ResponseEntity<VendaResponseDTO> cancelar(@PathVariable Long id) {
        return ResponseEntity.ok(vendaService.cancelar(id));
    }
}
