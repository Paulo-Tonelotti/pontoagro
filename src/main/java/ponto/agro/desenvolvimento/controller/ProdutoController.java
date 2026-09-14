package ponto.agro.desenvolvimento.controller;

import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import ponto.agro.desenvolvimento.dto.EntradaEstoqueRequestDTO;
import ponto.agro.desenvolvimento.dto.MovimentacaoEstoqueResponseDTO;
import ponto.agro.desenvolvimento.dto.ProdutoRequestDTO;
import ponto.agro.desenvolvimento.dto.ProdutoResponseDTO;
import ponto.agro.desenvolvimento.models.enums.UnidadeMedida;
import ponto.agro.desenvolvimento.services.ProdutoService;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/produtos")
public class ProdutoController {

    private final ProdutoService produtoService;

    public ProdutoController(ProdutoService produtoService) {
        this.produtoService = produtoService;
    }

    @GetMapping("/unidades-medida")
    public List<UnidadeMedida> listarUnidadesMedida(){
        return List.of(UnidadeMedida.values());
    }

    @GetMapping("/codigo-barras/{codigoBarra}")
    public ResponseEntity<ProdutoResponseDTO> buscarPorCodigoBarra(@PathVariable String codigoBarra){
        return ResponseEntity.ok(produtoService.buscarPorCodigoBarra(codigoBarra));
    }

    @PostMapping
    public ResponseEntity<ProdutoResponseDTO> salvarProduto(@Valid @RequestBody ProdutoRequestDTO produtoDto){
        ProdutoResponseDTO response = produtoService.salvar(produtoDto);

        URI uri = ServletUriComponentsBuilder
                .fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(response.id())
                .toUri();

        return ResponseEntity.created(uri).body(response);
    }

    @GetMapping
    public ResponseEntity<List<ProdutoResponseDTO>> listarProdutos(){
        List<ProdutoResponseDTO> produtos = produtoService.buscarTodos();
        return ResponseEntity.ok(produtos);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProdutoResponseDTO> buscarProduto(@PathVariable Long id){
        ProdutoResponseDTO response = produtoService.buscarPorIdDto(id);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProdutoResponseDTO> atualizarProduto(@PathVariable Long id, @Valid @RequestBody ProdutoRequestDTO produtoDto){
        ProdutoResponseDTO response = produtoService.atualizarProduto(id, produtoDto);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> removerProduto(@PathVariable Long id){
        produtoService.deletarProduto(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/entradas")
    public ResponseEntity<ProdutoResponseDTO> darEntradaEstoque(@PathVariable Long id, @Valid @RequestBody EntradaEstoqueRequestDTO dto){
        return ResponseEntity.ok(produtoService.darEntradaEstoque(id, dto));
    }

    @GetMapping("/{id}/movimentacoes")
    public ResponseEntity<List<MovimentacaoEstoqueResponseDTO>> listarMovimentacoes(@PathVariable Long id){
        return ResponseEntity.ok(produtoService.listarMovimentacoes(id));
    }
}
