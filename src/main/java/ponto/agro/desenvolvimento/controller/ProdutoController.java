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
}
