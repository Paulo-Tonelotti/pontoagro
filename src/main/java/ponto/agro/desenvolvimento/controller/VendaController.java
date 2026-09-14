package ponto.agro.desenvolvimento.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import jakarta.validation.Valid;
import ponto.agro.desenvolvimento.dto.VendaRequestDTO;
import ponto.agro.desenvolvimento.dto.VendaResponseDTO;
import ponto.agro.desenvolvimento.services.VendaService;

import java.net.URI;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;


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
    
}
