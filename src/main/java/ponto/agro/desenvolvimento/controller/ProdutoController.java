package ponto.agro.desenvolvimento.controller;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ponto.agro.desenvolvimento.models.Produto;
import ponto.agro.desenvolvimento.models.enums.UnidadeMedida;
import ponto.agro.desenvolvimento.services.ProdutoService;

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
    public ResponseEntity<Produto> salvarProduto(@Valid @RequestBody Produto produto){
        Produto produtoSalvo = produtoService.salvar(produto);
        return ResponseEntity.status(HttpStatus.CREATED).body(produtoSalvo);
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
