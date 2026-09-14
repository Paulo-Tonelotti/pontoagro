package ponto.agro.desenvolvimento.controller;

import java.util.List;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import ponto.agro.desenvolvimento.dto.OperadorRequestDTO;
import ponto.agro.desenvolvimento.dto.OperadorResponseDTO;
import ponto.agro.desenvolvimento.dto.OperadorUpdateRequestDTO;
import ponto.agro.desenvolvimento.services.OperadorService;

@RestController
@RequestMapping("/operadores")
public class OperadorController {

    private final OperadorService operadorService;

    public OperadorController(OperadorService operadorService) {
        this.operadorService = operadorService;
    }

    @PostMapping
    public ResponseEntity<OperadorResponseDTO> cadastrar(@Valid @RequestBody OperadorRequestDTO dto) {
        OperadorResponseDTO response = operadorService.cadastrar(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    public ResponseEntity<List<OperadorResponseDTO>> listar() {
        return ResponseEntity.ok(operadorService.listar());
    }

    @PutMapping("/{id}")
    public ResponseEntity<OperadorResponseDTO> atualizar(@PathVariable Long id, @Valid @RequestBody OperadorUpdateRequestDTO dto) {
        return ResponseEntity.ok(operadorService.atualizar(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> inativar(@PathVariable Long id) {
        operadorService.inativar(id);
        return ResponseEntity.noContent().build();
    }
}
