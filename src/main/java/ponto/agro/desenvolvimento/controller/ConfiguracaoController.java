package ponto.agro.desenvolvimento.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import ponto.agro.desenvolvimento.dto.ConfiguracaoRequestDTO;
import ponto.agro.desenvolvimento.dto.ConfiguracaoResponseDTO;
import ponto.agro.desenvolvimento.services.ConfiguracaoService;

@RestController
@RequestMapping("/configuracoes")
public class ConfiguracaoController {

    private final ConfiguracaoService configuracaoService;

    public ConfiguracaoController(ConfiguracaoService configuracaoService) {
        this.configuracaoService = configuracaoService;
    }

    @GetMapping
    public ResponseEntity<ConfiguracaoResponseDTO> buscar() {
        return ResponseEntity.ok(configuracaoService.buscar());
    }

    @PutMapping
    public ResponseEntity<ConfiguracaoResponseDTO> atualizar(@RequestBody ConfiguracaoRequestDTO dto) {
        return ResponseEntity.ok(configuracaoService.atualizar(dto));
    }
}
