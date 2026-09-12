package ponto.agro.desenvolvimento.controller;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import ponto.agro.desenvolvimento.dto.ProdutoRequestDTO;
import ponto.agro.desenvolvimento.dto.ProdutoResponseDTO;
import ponto.agro.desenvolvimento.models.Produto;
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
    public ResponseEntity<List<Produto>> listarProdutos(){
        List<Produto> produtos = produtoService.buscarTodos();
        return ResponseEntity.status(HttpStatus.OK).body(produtos);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Produto> buscarProduto(@PathVariable Long id){
        return ResponseEntity.status(HttpStatus.OK).body(produtoService.buscarPorId(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Produto> atualizarProduto(@PathVariable Long id, @Valid @RequestBody Produto produto){
        Produto produtoAtualizado = produtoService.atualizarProduto(id, produto);
        return ResponseEntity.status(HttpStatus.OK).body(produtoAtualizado);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> removerProduto(@PathVariable Long id){
        produtoService.deletarProduto(id);
        return ResponseEntity.noContent().build();
    }
}
